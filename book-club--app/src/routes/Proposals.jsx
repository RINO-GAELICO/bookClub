import { useState, useEffect } from "react";
import { api } from "../api";
import bookCoverImage from "../assets/placeholder-title.jpeg";
import "../css/Proposals.css";

function Proposals() {
    const [isEditable, setIsEditable] = useState(false);
    const [proposalId, setProposalId] = useState(null); // Store proposal ID
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("Sample Title");
    const [author, setAuthor] = useState("Sample Author");
    const [introParagraph, setIntroParagraph] = useState(
        "This is an introductory paragraph."
    );
    const [error, setError] = useState("");

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

    useEffect(() => {
        const fetchProposal = async () => {
            const token = sessionStorage.getItem("accessToken");
            if (!token) {
                setError("You must be logged in.");
                return;
            }

            try {
                const userId = 1;
                const response = await api.get(`/proposals/week?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.length > 0) {
                    const userProposal = response.data[0]; // Assuming only one proposal per user per week
                    console.log("User Proposal:", userProposal);
                    setProposalId(userProposal.id);
                    setTitle(userProposal.title);
                    setIntroParagraph(userProposal.description);
                }
            } catch (error) {
                console.error("Error fetching proposal:", error);
            }
        };

        fetchProposal();
    }, []);

    const handleSaveProposal = async () => {
        setIsEditable(!isEditable);
        if (!isEditable) return;

        if (title.trim() === "" || introParagraph.trim() === "") {
            setError("Title and Introduction are required.");
            return;
        }

        const token = sessionStorage.getItem("accessToken");
        if (!token) {
            setError("You must be logged in.");
            return;
        }

        const proposalData = {
            title,
            description: introParagraph,
        };

        try {
            if (proposalId) {
                // Update existing proposal
                await api.patch(`/proposals/${proposalId}`, proposalData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // Create new proposal
                const response = await api.post(
                    "/proposal/post",
                    {
                        ...proposalData,
                        week: 1, // Replace with correct week calculation
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setProposalId(response.data.id); // Save the new proposal ID
            }

            console.log("Proposal saved successfully.");
        } catch (error) {
            console.error("Failed to save proposal:", error);
            setError("Failed to save proposal.");
        }
    };

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

                        {/* Handle saving the proposal */}
                        {
                            <button onClick={handleSaveProposal}>
                                {isEditable ? "Save Proposal" : "Edit Proposal"}
                            </button>
                        }
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
