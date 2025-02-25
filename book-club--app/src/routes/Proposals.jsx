import { useState, useEffect } from "react";
import { api } from "../api";
import useAuth from "../context/useAuth";
import bookCoverImage from "../assets/placeholder-title.jpeg";
import "../css/Proposals.css";

function Proposals() {
    const { user, accessToken } = useAuth();
    const [isEditable, setIsEditable] = useState(false);
    const [image, setImage] = useState(null);
    const [myProposal, setMyProposal] = useState({
        title: "",
        description: "",
        author: "",
        id: null,
    });
    const [proposals, setProposals] = useState([]);
    const [voted, setVoted] = useState(null);
    const [votes, setVotes] = useState([]);
    const [error, setError] = useState("");

    console.log("User:", user);

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                const response = await api.get(`/proposals/week`);

                if (response.data.length > 0) {
                    // find the user's proposal
                    const userProposal = response.data.find(
                        (proposal) => proposal.userId === user.userId
                    );
                    if (userProposal) {
                        setMyProposal(userProposal);
                    }
                    // set the proposals excluding the user's proposal
                    setProposals(
                        response.data.filter(
                            (proposal) => proposal.userId !== user.userId
                        )
                    );
                }
            } catch (error) {
                console.error("Error fetching proposal:", error);
            }
        };

        const fetchVotes = async () => {
            try {
                const response = await api.get(`/votes/week`);

                const fetchedVotes = response.data; // Store the fetched votes in a variable

                setVotes(fetchedVotes); // Update state

                // if the votes include the logged in user's vote, set the proposal as voted
                if (fetchedVotes.find((vote) => vote.userId === user.userId)) {
                    setVoted(fetchedVotes.find((vote) => vote.userId === user.userId).proposalId);
                }
            } catch (error) {
                console.error("Error fetching votes:", error);
            }
        };

        fetchProposal();
        fetchVotes();

    }, []);

    const handleVoting = async (votedProposalId) => {
        console.log("Voting for proposal:", votedProposalId);
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
            setError("You must be logged in.");
            return;
        }

        console.log("Access Token:", token);

        const voteData = {
            userId: user.userId,
            proposalId: votedProposalId,
        };

        try {
            if (voted) {
                // Patch vote
                console.log("Updating vote:", voteData);
                await api.patch(`/votes/week`, voteData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setVoted(votedProposalId);
            }else{
                console.log("Creating new vote:", voteData);
                // Create new vote
                await api.post(`/proposals/vote`, voteData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setVoted(votedProposalId);
            }
        } catch (error) {
            console.error("Failed to save vote:", error);
            setError("Failed to save vote.");
        }
    };

    const handleSaveProposal = async () => {
        setIsEditable(!isEditable);
        if (!isEditable) return;

        if (
            myProposal.title.trim() === "" ||
            myProposal.description.trim() === "" ||
            myProposal.author.trim() === ""
        ) {
            setError("Title, Author, and Description are required.");
            return;
        }

        const token = sessionStorage.getItem("accessToken");
        if (!token) {
            setError("You must be logged in.");
            return;
        }

        console.log("Access Token:", token);

        const proposalData = {
            userId: user.userId,
            title: myProposal.title,
            description: myProposal.description,
            author: myProposal.author,
        };

        try {
            if (myProposal.id) {
                // Update existing proposal
                await api.patch(`/proposals/${myProposal.id}`, proposalData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // Create new proposal
                console.log("Creating new proposal:", proposalData);
                const response = await api.post(
                    "/proposal/post",
                    {
                        ...proposalData,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setMyProposal({
                    ...myProposal,
                    id: response.data.id,
                    userId: response.data.userId,
                    title: response.data.title,
                    description: response.data.description,
                    author: response.data.author,
                });
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
                                    value={myProposal?.title}
                                    placeholder="Title"
                                    onChange={(e) =>
                                        setMyProposal({
                                            ...myProposal,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p>{myProposal?.title || "Title here"}</p>
                            )}
                        </div>

                        <div className="editable-field">
                            <label htmlFor="author">Author:</label>
                            {isEditable ? (
                                <input
                                    id="author"
                                    type="text"
                                    value={myProposal?.author}
                                    placeholder="Author"
                                    onChange={(e) =>
                                        setMyProposal({
                                            ...myProposal,
                                            author: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p>{myProposal?.author || "Author here"}</p>
                            )}
                        </div>

                        <div className="editable-field">
                            <label htmlFor="introParagraph">
                                Introductory Paragraph:
                            </label>
                            {isEditable ? (
                                <textarea
                                    id="description"
                                    value={myProposal?.description}
                                    placeholder="Description"
                                    onChange={(e) =>
                                        setMyProposal({
                                            ...myProposal,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            ) : (
                                <p>
                                    {myProposal?.description ||
                                        "Description here"}
                                </p>
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
                                    src={bookCoverImage}
                                    alt="Proposal Image"
                                    className="proposal-img"
                                />
                            </div>
                            <div className="proposal-info">
                                <h3>{proposal.title}</h3>
                                <p>Author: {proposal.author}</p>
                                <p>{proposal.description}</p>
                                <p> Total votes: {votes.filter((vote) => vote.proposalId === proposal.id).length}</p>
                            </div>
                            <div className="proposal-vote">
                                <button className="vote-button"
                                onClick={() => handleVoting(proposal.id)}
                                disabled={voted === proposal.id}
                                >
                                    {voted === proposal.id ? "You Voted This" : "Vote"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Proposals;
