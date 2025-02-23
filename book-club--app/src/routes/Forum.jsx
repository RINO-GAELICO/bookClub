import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../css/Forum.css";
import { api } from "../api";

// Import placeholder book cover
import bookCoverImage from "../assets/placeholder-title.jpeg";
import avatarPic from "../assets/profile-placeholder.jpeg";

function Forum() {

    const { proposalId } = useParams();
    const [error, setError] = useState("");

    // Placeholder data for the book discussion
    const bookTitle = "Educated";
    const bookAuthor = "Tara Westover";
    const bookPresentation =
        "An unforgettable memoir about a young person who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University";

    const [comments, setComments] = useState([]);

    useEffect(() => {
        // Fetch comments related to the current proposalId
        const fetchComments = async () => {
            try {
                const response = await api.get(`/comments/proposal/${proposalId}`);
                setComments(response.data);
            } catch (err) {
                setError("Failed to fetch comments.", err);
            }
        };

        fetchComments();
    }, [proposalId]);

    console.log("comments", comments);

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
            proposalId: proposalId,
            userId: 1,
            content: newComment,
            timestamp: new Date(),
            avatar: avatarPic,
            replyTo: replyingTo ? replyingTo.id : null,
        };
        console.log("Posting comment:", newCommentData);
        console.log("replyingTo", replyingTo);
        try {
            const response = await api.post("/comment/post", newCommentData);

            console.log("response ", response.data);

            // Add the newly created comment from backend response to state
            setComments((prevComments) => [...prevComments, response.data]);

            setNewComment("");
            setReplyingTo(null);

            // Scroll to the new comment after rendering
            setTimeout(() => {
                const newCommentElement = document.getElementById(`comment-${response.data.id}`);
                if (newCommentElement) {
                    newCommentElement.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
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

    return (
        <div>
            <div className="forum-container">
                {/* Forum Header */}
                <div className="forum-header">
                    <div className="header-top">
                        <img
                            src={bookCoverImage}
                            alt={`${bookTitle} cover`}
                            className="book-cover"
                        />
                        <div className="book-meta">
                            <h1 className="book-title">{bookTitle}</h1>
                            <h2 className="book-author">By {bookAuthor}</h2>
                        </div>
                    </div>
                    <div className="book-presentation">
                        <p>{bookPresentation}</p>
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
                                        src={avatarPic}
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
                                                (c) =>
                                                    c.id === comment.replyTo
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
