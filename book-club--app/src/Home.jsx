import { Link } from "react-router-dom";
import "./css/Home.css";
// Importing the book cover image
import bookCoverImage from "./assets/placeholder-title.jpeg";

function Home() {
    // Placeholder data for the book of the week
    const bookTitle = "Educated";
    const bookAuthor = "Tara Westover";
    const bookDescription = "Educated is a memoir by the American author Tara Westover. It details her journey from growing up in a strict household in rural Idaho and not attending school, to eventually earning a PhD from the University of Cambridge.";

    const bookId = "1"; // Placeholder book ID

    return (
        <div className="hero-background">
            <div className="overlay"></div>
            <div className="hero-content">
                <div className="welcome-section">
                    <h1>Welcome to the Book Club</h1>
                    <hr className="separator" />
                    <p className="subtext">
                        The Book Club is organized by a group of people who come
                        together to read and discuss books. Join us to explore
                        new ideas and share your thoughts!
                    </p>
                </div>

                {/* Selection of the Week Card */}
                <div className="card selection-of-the-week">
                    <div className="book-info">
                        <div className="book-details">
                            <h2>Selection of the Week</h2>
                            {/* Separator Line */}
                            <hr className="separator" />
                            <p className="book-title">
                                We are currently reading:{" "}
                                <strong>{bookTitle}</strong>
                            </p>
                            <p className="book-author">
                                By <strong>{bookAuthor}</strong>
                            </p>
                        </div>
                        <div className="book-cover">
                            <img
                                src={bookCoverImage}
                                alt={`${bookTitle} cover`}
                            />
                        </div>
                    </div>

                    {/* Book Description */}
                    <p className="book-description">{bookDescription}</p>

                    {/* Join Discussion Button */}
                    <Link to={`/forum/${bookId}`} className="discussion-button">
                        Join the Discussion
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
