import { useState } from "react";
// import { useParams } from "react-router-dom";
import "../css/Forum.css";

// Import placeholder book cover
import bookCoverImage from "../assets/placeholder-title.jpeg";

function Forum() {
    // const { id_book } = useParams(); // Retrieve book ID from URL

    // Placeholder data for the book discussion
    const bookTitle = "Educated";
    const bookAuthor = "Tara Westover";
    const bookPresentation = "An unforgettable memoir about a young person who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University";

    // Placeholder comments
    const [comments, setComments] = useState([
        { id: 1, user: "Alice", text: "I love how Gatsby represents the illusion of the American Dream!" },
        { id: 2, user: "Bob", text: "The green light is such a powerful symbol of hope and unattainable dreams." }
    ]);

    // State for new comment input
    const [newComment, setNewComment] = useState("");

    // Handle posting a new comment
    const handlePostComment = () => {
        if (newComment.trim() === "") return;
        const newCommentData = {
            id: comments.length + 1,
            user: "Guest User",
            text: newComment
        };
        setComments([...comments, newCommentData]);
        setNewComment(""); // Clear input field
    };

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          e.preventDefault(); // Prevent default behavior (line break)
          handlePostComment(); // Call the post comment function
      }
  };

    return (
      <div>
        <div className="forum-container">
            {/* Forum Header */}
            <div className="forum-header">
                <div className="header-top">
                    <img src={bookCoverImage} alt={`${bookTitle} cover`} className="book-cover" />
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
                        {comments.map(comment => (
                            <div key={comment.id} className="comment">
                                <strong>{comment.user}:</strong> {comment.text}
                            </div>
                        ))}
                    </div>

                    {/* New Comment Input */}
                    <div className="comment-input">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write your comment here..."
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handlePostComment}>Post Comment</button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Forum;
