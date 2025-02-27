import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./css/Home.css";
import { api } from "./api";
// Importing the book cover image
import bookCoverPlaceHolder from "./assets/placeholder-no-title.jpeg";

function Home() {
    // Placeholder data for the book of the week
    const bookTitle = "Educated";
    const bookAuthor = "Tara Westover";
    const bookDescription =
        "Educated is a memoir by the American author Tara Westover. It details her journey from growing up in a strict household in rural Idaho and not attending school, to eventually earning a PhD from the University of Cambridge.";

    const bookId = "1"; // Placeholder book ID
    const [proposal, setProposal] = useState({});
    const [error, setError] = useState(null);
    const [week, setWeek] = useState(1);

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                const response = await api.get("/proposals/most-voted");
                setProposal(response.data);
                console.log("Most Voted Proposal, ", proposal);
            } catch (err) {
                setError("Failed to fetch proposal.", err);
            }
        };

        fetchProposal();
    }, []);

    useEffect(() => {
        if (proposal) {
            setWeek(proposal.week);
            console.log("Week: ", proposal.week);
        }
    }, [proposal]);

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
                                <strong>{proposal.title}</strong>
                            </p>
                            <p className="book-author">
                                By <strong>{proposal.author}</strong>
                            </p>
                        </div>
                        <div className="book-cover">
                            <img
                                src={proposal.imageUrl || bookCoverPlaceHolder}
                                alt={`${proposal.title} cover`}
                            />
                        </div>
                    </div>

                    {/* Book Description */}
                    <p className="book-description">{proposal.description}</p>

                    {/* Join Discussion Button */}
                    <Link to={`/forum/${week}`} className="discussion-button">
                        Join the Discussion
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
