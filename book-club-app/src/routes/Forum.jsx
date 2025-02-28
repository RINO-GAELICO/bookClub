import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../css/Forum.css";
import { api } from "../api";
import useAuth from "../context/useAuth";
import bookCoverPlaceHolder from "../assets/placeholder-no-title.jpeg";
import avatarPic from "../assets/profile-placeholder.jpeg";
import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_BACKEND_SOCKET_URL;

function Forum() {
    const { week } = useParams();
    const [error, setError] = useState("");
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [proposal, setProposal] = useState(null);
    const [socket, setSocket] = useState(null); // State to store socket instance
    // retrieve avatar from local storage
    const avatar = localStorage.getItem("avatar");
    console.log(`Avatar: ${avatar}`);

    useEffect(() => {
        // Fetch proposal first
        const fetchProposal = async () => {
            try {
                const response = await api.get("/proposals/most-voted");
                setProposal(response.data);
                console.log("Most Voted Proposal, ", response.data);
            } catch (err) {
                setError("Failed to fetch proposal.", err);
            }
        };

        fetchProposal();
    }, []);

    useEffect(() => {
        if (proposal && proposal.id) {
            // Only fetch comments once the proposal has been fetched
            const fetchComments = async () => {
                try {
                    const response = await api.get(
                        `/comments/proposal/${proposal.id}`
                    );
                    setComments(response.data);
                } catch (err) {
                    setError("Failed to fetch comments.", err);
                }
            };
            fetchComments();
        }
    }, [proposal]);

    useEffect(() => {
        if (week) {
            const socketInstance = io(SOCKET_URL);
            setSocket(socketInstance);

            // Listen for real-time comment updates
            socketInstance.on("comments", (newComment) => {
                // check if the comment is for the current week
                if (newComment?.proposalId !== proposal?.id) return;
                // Add the new comment to the state only if it's not already in the list
                setComments((prevComments) => {
                    // Check if the comment is already in the state to avoid duplicates
                    if (!prevComments.some((c) => c.id === newComment.id)) {
                        const updatedComments = [...prevComments, newComment];
                        // Optionally: Scroll to the new comment after rendering
                        setTimeout(() => {
                            const newCommentElement = document.getElementById(
                                `comment-${newComment.id}`
                            );
                            if (newCommentElement) {
                                newCommentElement.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }
                        }, 100);
                        return updatedComments;
                    }
                    return prevComments; // Return unchanged state if the comment is already present
                });
            });

            // Cleanup function to leave room and remove event listener
            return () => {
                socketInstance.off("comments");
                // socketInstance.emit('leave', week); // Optionally leave the room when unmounting
                socketInstance.disconnect(); // Disconnect the socket on component unmount
            };
        }
    }, [week]);

    // State for new comment input
    const [newComment, setNewComment] = useState("");
    const [hoveredComment, setHoveredComment] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);

    const textareaRef = useRef(null); // React ref for the textarea

    // Helper function to format timestamp like Discord
    const formatTimestamp = (date) => {
        if (!date) return "Unknown time"; // Prevent error if timestamp is missing
        const options = { hour: "2-digit", minute: "2-digit", hour12: true };
        return `Today at ${new Date(date).toLocaleTimeString([], options)}`;
    };

    // Handle posting a new comment
    const handlePostComment = async () => {
        if (newComment.trim() === "") return;

        const newCommentData = {
            proposalId: proposal.id,
            userId: user.userId,
            content: newComment,
            timestamp: new Date(),
            replyTo: replyingTo ? replyingTo.id : null,
        };

        try {
            // Get the token from storage (sessionStorage, localStorage, or wherever it is stored)
            const token = sessionStorage.getItem("accessToken"); // Or wherever you're storing it

            if (!token) {
                setError("You must be logged in to post a comment.");
                return;
            }

            // Send the token in the Authorization header
            const response = await api.post("/comment/post", newCommentData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the Authorization header with the token
                },
            });

            setNewComment("");
            setReplyingTo(null);

        } catch (error) {
            console.error("Failed to post comment:", error);
            setError("Failed to post comment. Please try again.");
        }
    };

    // Function to insert markdown at the cursor position
    const insertTextAtCursor = (before, after = "") => {
        console.log("insertTextAtCursor fired");
        const textarea = textareaRef.current;
        if (!textarea) return;
        console.log("textarea", textarea);

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const newText =
            text.substring(0, start) +
            before +
            text.substring(start, end) +
            after +
            text.substring(end);
        setNewComment(newText);

        // Move cursor inside the inserted syntax if applicable
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
                start + before.length;
            textarea.focus();
        }, 10);
    };

    // Function to insert text at the cursor position in the comment input
    const handleKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault(); // Prevent default behavior (line break)
            handlePostComment(); // Call the post comment function
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert("Comment copied!");
    };

    const handleScrollReply = (replyCommentId) => {
        const commentElement = document.getElementById(
            `comment-${replyCommentId}`
        );
        if (commentElement) {
            commentElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            // Add highlight class
            commentElement.classList.add("highlight");

            // After 1.5s, start fading out
            setTimeout(() => {
                commentElement.classList.add("fade-out");
            }, 1500);

            // After 3s, remove both classes
            setTimeout(() => {
                commentElement.classList.remove("highlight", "fade-out");
            }, 3000);
        }
    };

    const handleReply = (comment) => {
        console.log(`Commenting to ${JSON.stringify(comment)}`);
        setReplyingTo(comment); // Store the comment being replied to
        document.getElementById("comment-textarea").focus();
    };

    console.log("Comments", comments);
    console.log(`User: ${JSON.stringify(user)}`);
    return (
        <div>
            <div className="forum-container">
                {/* Forum Header */}
                <div className="forum-header">
                    <div className="header-top">
                        <img
                            src={proposal?.imageUrl || bookCoverPlaceHolder}
                            alt={`${proposal?.title} cover`}
                            className="book-cover"
                        />
                        <div className="book-meta">
                            <h1 className="book-title">{proposal?.title}</h1>
                            <h2 className="book-author">
                                By {proposal?.author}
                            </h2>
                        </div>
                    </div>
                    <div className="book-description">
                        <p className="book-description-paragraph">
                            {proposal?.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* New Card for Discussion Section */}
            <div className="discussion-container">
                <div className="discussion-card">
                    <h1>Discussion</h1>
                    <hr className="separator" />

                    {/* List of Comments */}
                    <ol className="comments-list">
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                id={`comment-${comment.id}`}
                                className="comment"
                                onMouseEnter={() =>
                                    setHoveredComment(comment.id)
                                }
                                onMouseLeave={() => setHoveredComment(null)}
                            >
                                <div className="comment-header">
                                    <img
                                        // TODO - Use the actual avatar URL from the API
                                        src={comment.User.avatar || avatarPic}
                                        alt={`${comment.user}'s avatar`}
                                        className="comment-avatar"
                                    />
                                    <div className="comment-info">
                                        <strong className="comment-user">
                                            {comment.User.username}
                                        </strong>
                                        <span className="comment-timestamp">
                                            {formatTimestamp(comment.timestamp)}
                                        </span>
                                    </div>
                                    {/* Reply & Copy Buttons - Shown only when hovering */}
                                    {hoveredComment === comment.id && (
                                        <div className="comment-actions">
                                            <button
                                                className="reply-button"
                                                onClick={() =>
                                                    handleReply(comment)
                                                }
                                            >
                                                ↩ Reply
                                            </button>
                                            <button
                                                className="copy-button"
                                                onClick={() =>
                                                    handleCopy(comment.text)
                                                }
                                            >
                                                📋 Copy
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {comment.replyTo && (
                                    <div className="reply-reference">
                                        Replying to{" "}
                                        <span
                                            className="reply-username"
                                            style={{
                                                cursor: "pointer",
                                                color: "#007BFF",
                                                textDecoration: "underline",
                                            }}
                                            onClick={() =>
                                                handleScrollReply(
                                                    comment.replyTo
                                                )
                                            }
                                        >
                                            {comments.find(
                                                (c) => c.id === comment.replyTo
                                            )?.User.username || "Unknown"}
                                        </span>
                                    </div>
                                )}
                                <ReactMarkdown
                                    className="comment-text"
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {comment.content}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </ol>

                    {/* New Comment Input */}
                    <div className="comment-input">
                        {/* Formatting Buttons */}
                        <div className="formatting-buttons">
                            <button
                                onClick={() => insertTextAtCursor("**", "**")}
                            >
                                <b>B</b>
                            </button>
                            <button
                                onClick={() => insertTextAtCursor("*", "*")}
                            >
                                <i>I</i>
                            </button>
                            <button
                                onClick={() => insertTextAtCursor("~~", "~~")}
                            >
                                <s>S</s>
                            </button>
                            <button
                                onClick={() =>
                                    insertTextAtCursor("[", "](url)")
                                }
                            >
                                🔗
                            </button>
                        </div>

                        {/* Reply Label (Appears only if replyingTo is set) */}
                        {replyingTo && (
                            <div className="reply-label">
                                Replying to{" "}
                                <span
                                    className="reply-username"
                                    onClick={() =>
                                        handleScrollReply(replyingTo.id)
                                    }
                                    style={{
                                        cursor: "pointer",
                                        color: "#007BFF",
                                        textDecoration: "underline",
                                    }}
                                >
                                    {replyingTo.User.username}
                                </span>
                                <button
                                    className="cancel-reply"
                                    onClick={() => setReplyingTo(null)}
                                >
                                    ✖
                                </button>
                            </div>
                        )}

                        {/* Comment Input */}
                        <textarea
                            id="comment-textarea"
                            ref={textareaRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write your comment here..."
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handlePostComment}>
                            Post Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Forum;
