import { useState, useEffect } from "react";
import { api } from "../api";
import useAuth from "../context/useAuth";
import bookCoverPlaceHolder from "../assets/placeholder-no-title.jpeg";
import "../css/Proposals.css";
import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_BACKEND_SOCKET_URL;

const socket = io(SOCKET_URL, {
    withCredentials: true,
});

function Proposals() {
    const { user, accessToken } = useAuth();
    const [isEditable, setIsEditable] = useState(false);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [myProposal, setMyProposal] = useState({
        title: "",
        description: "",
        author: "",
        id: null,
        thumbnailUrl: null,
        imageUrl: null,
    });
    const [proposals, setProposals] = useState([]);
    const [voted, setVoted] = useState(null);
    const [votes, setVotes] = useState([]);
    const [error, setError] = useState("");

    const fetchVotes = async () => {
        try {
            const response = await api.get(`/votes/week`);

            const fetchedVotes = response.data; // Store the fetched votes in a variable

            setVotes(fetchedVotes); // Update state

            // if the votes include the logged in user's vote, set the proposal as voted
            if (fetchedVotes.find((vote) => vote.userId === user.userId)) {
                setVoted(
                    fetchedVotes.find((vote) => vote.userId === user.userId)
                        .proposalId
                );
            }
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
    };

    console.log("User:", user);

    useEffect(() => {
        if (!user || !user.userId) return;
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

        fetchProposal();
        fetchVotes();

        // Listen for real-time image updates
        socket.on("imageUpdated", ({ proposalId, imageUrl }) => {
            setProposals((prevProposals) =>
                prevProposals.map((proposal) =>
                    proposal.id == proposalId
                        ? { ...proposal, imageUrl }
                        : proposal
                )
            );
        });

        // Listen for real-time vote updates
        socket.on("voteUpdated", ({ newVotes }) => {
            setVotes(newVotes);
            console.log("Votes updated:", newVotes);
        });

        return () => {
            socket.off("imageUpdated");
            socket.off("voteUpdated");
        };
    }, [user]);

    const handleVoting = async (votedProposalId) => {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
            setError("You must be logged in.");
            return;
        }

        const voteData = {
            userId: user.userId,
            proposalId: votedProposalId,
        };

        try {
            if (voted) {
                // Patch vote
                await api.patch(`/votes/week`, voteData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setVoted(votedProposalId);
            } else {
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
        fetchVotes();
    };

    const handleSaveProposal = async () => {
        setIsEditable(!isEditable);
        if (!isEditable) return;

        if (
            myProposal.title.trim() === "" ||
            myProposal.description.trim() === "" ||
            myProposal.author.trim() === ""
        ) {
            console.log("Title, Author, and Description are required.");
            setError("Title, Author, and Description are required.");
            return;
        }

        const token = sessionStorage.getItem("accessToken");
        if (!token) {
            console.log("You must be logged in.");
            setError("You must be logged in.");
            return;
        }


        // Create FormData to send image file and text fields
        const formData = new FormData();
        formData.append("userId", user.userId);
        formData.append("title", myProposal.title);
        formData.append("description", myProposal.description);
        formData.append("author", myProposal.author);

        if (imageFile) {
            formData.append("image", imageFile); // Attach image if available
        }

        try {
            let response;
            if (myProposal.id) {
                // Update existing proposal
                response = await api.patch(
                    `/proposals/${myProposal.id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                // Create new proposal
                response = await api.post("/proposal/post", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                // Set new proposal data
                setMyProposal({
                    ...myProposal,
                    id: response.data.id,
                    userId: response.data.userId,
                    title: response.data.title,
                    description: response.data.description,
                    author: response.data.author,
                    imageUrl: response.data.imageUrl, // Store returned image URL
                    thumbnailUrl: response.data.thumbnailUrl, // Store returned thumbnail URL
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
            setImageFile(file); // Store file for upload
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
                            <img
                                src={
                                    image ||
                                    myProposal.imageUrl ||
                                    bookCoverPlaceHolder
                                }
                                alt="Book"
                                className="book-image"
                            />
                        </div>

                        {/* Upload Button */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: "none" }}
                            id="imageUpload"
                        />
                        <label htmlFor="imageUpload" className="upload-button">
                            {myProposal.imageUrl
                                ? "Change Image"
                                : "Upload Image"}
                        </label>
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
                                    src={
                                        proposal.thumbnailUrl ||
                                        bookCoverPlaceHolder
                                    }
                                    alt="Proposal Image"
                                    className="proposal-img"
                                />
                            </div>
                            <div className="proposal-info">
                                <h3>{proposal.title}</h3>
                                <p>Author: {proposal.author}</p>
                                <p>{proposal.description}</p>
                                <p>
                                    {" "}
                                    Total votes:{" "}
                                    {
                                        votes.filter(
                                            (vote) =>
                                                vote.proposalId === proposal.id
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="proposal-vote">
                                <button
                                    // if the user has already voted for this proposal, append className with darkVote
                                    className={voted == proposal.id ? "vote-button darkVote" : "vote-button"}
                                    onClick={() => handleVoting(proposal.id)}
                                    disabled={voted === proposal.id}
                                >
                                    {voted === proposal.id
                                        ? "You Voted This"
                                        : "Vote"}
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
