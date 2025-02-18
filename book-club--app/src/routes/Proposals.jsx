import { useState } from "react";
import "../css/Proposals.css";
// Import placeholder book cover
import bookCoverImage from "../assets/placeholder-title.jpeg";

function Proposals() {
    const [isEditable, setIsEditable] = useState(false);
    const [image, setImage] = useState(null); // To handle image upload
    const [title, setTitle] = useState("Sample Title");
    const [author, setAuthor] = useState("Sample Author");
    const [introParagraph, setIntroParagraph] = useState(
        "This is an introductory paragraph."
    );

    // Sample proposals array (mock data)
    const proposals = [
        {
            id: 1,
            image: bookCoverImage,
            title: "Proposal 1 Title",
            author: "John Doe",
            intro: "This is a short introduction to Proposal 1. It provides an overview of the topic being proposed.",
        },
        {
            id: 2,
            image: bookCoverImage,
            title: "Proposal 2 Title",
            author: "Jane Smith",
            intro: "This is Proposal 2. It delves into a different topic, with a focus on its implications and outcomes.",
        },
        {
            id: 3,
            image: bookCoverImage,
            title: "Proposal 3 Title",
            author: "Emily Johnson",
            intro: "Proposal 3 explores various approaches to solving a particular problem. It examines several case studies.",
        },
    ];

    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // Set the uploaded image
        }
    };

    return (
        <div className="proposals-container">
            <h1>Proposals</h1>
            <div className="wrapper-your-proposal-container">
                <div className="proposal-header">
                    <h2>Your Proposal</h2>
                </div>
                <div className="your-proposal-container">
                    <div className="image-container">
                        {/* Book Image or Empty Frame */}
                        <div className="image-frame">
                            {image ? (
                                <img
                                    src={image}
                                    alt="Book"
                                    className="book-image"
                                />
                            ) : (
                                <div className="empty-frame">No Image</div>
                            )}
                        </div>

                        {/* Upload Button */}
                        {!image && (
                            <button
                                className="upload-button"
                                onClick={handleImageUpload}
                            >
                                Upload Image
                            </button>
                        )}
                    </div>

                    <div className="presentation-section">
                        <div className="editable-field">
                            <label htmlFor="title">Title:</label>
                            {isEditable ? (
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            ) : (
                                <p>{title}</p>
                            )}
                        </div>

                        <div className="editable-field">
                            <label htmlFor="author">Author:</label>
                            {isEditable ? (
                                <input
                                    id="author"
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                            ) : (
                                <p>{author}</p>
                            )}
                        </div>

                        <div className="editable-field">
                            <label htmlFor="introParagraph">
                                Introductory Paragraph:
                            </label>
                            {isEditable ? (
                                <textarea
                                    id="introParagraph"
                                    value={introParagraph}
                                    onChange={(e) =>
                                        setIntroParagraph(e.target.value)
                                    }
                                />
                            ) : (
                                <p>{introParagraph}</p>
                            )}
                        </div>

                        {/* Edit Button */}
                        <button onClick={() => setIsEditable((prev) => !prev)}>
                            {isEditable ? "Save" : "Edit"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Other Proposals Section */}
            <div className="other-proposals-container">
                <div className="proposal-header">
                    <h2>Other Proposals</h2>
                </div>

                {/* Proposal List */}
                <div className="proposal-list">
                    {proposals.map((proposal) => (
                        <div className="proposal-item" key={proposal.id}>
                            <div className="proposal-image">
                                <img
                                    src={proposal.image}
                                    alt="Proposal Image"
                                    className="proposal-img"
                                />
                            </div>
                            <div className="proposal-info">
                                <h3>{proposal.title}</h3>
                                <p>Author: {proposal.author}</p>
                                <p>{proposal.intro}</p>
                            </div>
                            <div className="proposal-vote">
                                <button className="vote-button">Vote</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Proposals;
