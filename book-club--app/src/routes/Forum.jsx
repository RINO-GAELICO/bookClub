import { useState, useRef } from "react";
// import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown"; // Import react-markdown
import remarkGfm from "remark-gfm";
import "../css/Forum.css";

// Import placeholder book cover
import bookCoverImage from "../assets/placeholder-title.jpeg";
import avatarPic from "../assets/profile-placeholder.jpeg";

function Forum() {
    // const { id_book } = useParams(); // Retrieve book ID from URL

    // Placeholder data for the book discussion
    const bookTitle = "Educated";
    const bookAuthor = "Tara Westover";
    const bookPresentation =
        "An unforgettable memoir about a young person who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University";

    // Placeholder comments
    const [comments, setComments] = useState([
        {
            id: 1,
            user: "Alice",
            text: "I love how **Gatsby** represents the illusion of the *American Dream*!",
            timestamp: new Date(),
            avatar: avatarPic,
        },
        {
            id: 2,
            user: "Bob",
            text: "The green light is such a powerful symbol of ~~hope~~ and unattainable dreams.",
            timestamp: new Date(),
            avatar: avatarPic,
        },
    ]);

    // State for new comment input
    const [newComment, setNewComment] = useState("");
    const [hoveredComment, setHoveredComment] = useState(null);

    const textareaRef = useRef(null); // React ref for the textarea

    // Helper function to format timestamp like Discord
    const formatTimestamp = (date) => {
        if (!date) return "Unknown time"; // Prevent error if timestamp is missing
        const options = { hour: "2-digit", minute: "2-digit", hour12: true };
        return `Today at ${new Date(date).toLocaleTimeString([], options)}`;
    };

    // Handle posting a new comment
    const handlePostComment = () => {
        if (newComment.trim() === "") return;
        const newCommentData = {
            id: comments.length + 1,
            user: "Guest User",
            text: newComment,
            timestamp: new Date(),
            avatar: avatarPic,
        };
        setComments([...comments, newCommentData]);
        setNewComment("");
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

    const handleReply = (username) => {
        setNewComment(`@${username} `);
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
                    <div className="comments-list">
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="comment"
                                onMouseEnter={() =>
                                    setHoveredComment(comment.id)
                                }
                                onMouseLeave={() => setHoveredComment(null)}
                            >
                                <div className="comment-header">
                                    <img
                                        src={comment.avatar}
                                        alt={`${comment.user}'s avatar`}
                                        className="comment-avatar"
                                    />
                                    <div className="comment-info">
                                        <strong className="comment-user">
                                            {comment.user}
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
                                                    handleReply(comment.user)
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
                                <ReactMarkdown
                                    className="comment-text"
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {comment.text}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>

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

                        {/* Comment Input */}
                        <textarea
                            ref={textareaRef} // <-- Make sure the ref is attached here
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
