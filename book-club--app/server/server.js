import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "./logger.js";
import dotenv from "dotenv";
import { sequelize } from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

// Load environment variables from .env file (Docker will inject them)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import routes
app.use("/api", userRoutes);
app.use("/api", proposalRoutes);
app.use("/api", commentRoutes);

app.use(
    morgan("combined", {
        stream: {
            write: (message) => {
                logger.info(message.replace("::ffff:", "")); // Removes IPv6 prefix
                console.log(message.replace("::ffff:", "")); // Logs to console
            },
        },
    })
);

app.use((err, req, res) => {
    console.error(err.stack); // Logs error in the console
    logger.error(err.stack); // Logs error in the log file
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
});


// // Route to get votes on a specific proposal
// app.get("/api/proposals/:proposalId/votes", (req, res) => {
//     const { proposalId } = req.params;
//     const votes = proposalVotes.proposalVotes.filter(
//         (vote) => vote.proposalId == proposalId
//     );
//     res.json(votes);
// });

// // Get all proposals created by a specific user
// app.get("/api/users/:userId/proposals", (req, res) => {
//     const { userId } = req.params;

//     const userProposals = proposals.proposals.filter(
//         (proposal) => proposal.userId == userId
//     );

//     res.json(userProposals);
// });



// // Vote on a proposal
// app.post("/api/proposals/:proposalId/vote", (req, res) => {
//     const { proposalId } = req.params;
//     const { userId } = req.body;

//     // Check if the user has already voted on this proposal
//     const existingVote = proposalVotes.find(
//         (vote) => vote.userId == userId && vote.proposalId == proposalId
//     );

//     if (existingVote) {
//         return res
//             .status(400)
//             .json({ error: "You have already voted on this proposal" });
//     }

//     const newVote = {
//         userId,
//         proposalId,
//     };

//     proposalVotes.push(newVote);
//     fs.writeFileSync(
//         path.resolve("server", "mockData", "proposalVotes.json"),
//         JSON.stringify(proposalVotes)
//     );

//     res.status(201).json(newVote);
// });


// // Channge vote on a proposal
// app.put("/api/proposals/:proposalId/:userId/vote", (req, res) => {
//     const { proposalId, userId } = req.params;

//     const existingVote = proposalVotes.find(
//         (vote) => vote.userId == userId && vote.proposalId == proposalId
//     );

//     if (!existingVote) {
//         return res
//             .status(400)
//             .json({ error: "You have not voted on this proposal" });
//     }

//     const proposalVotesFiltered = proposalVotes.filter(
//         (vote) => !(vote.userId == userId && vote.proposalId == proposalId)
//     );

//     fs.writeFileSync(
//         path.resolve("server", "mockData", "proposalVotes.json"),
//         JSON.stringify(proposalVotesFiltered)
//     );

//     res.status(200).json({ message: "Vote removed" });
// });

// // change comment
// app.put("/api/comments/:commentId", (req, res) => {
//     const { commentId } = req.params;
//     const { commentText } = req.body;

//     const comment = comments.find((c) => c.commentId == commentId);

//     if (!comment) {
//         return res.status(404).json({ error: "Comment not found" });
//     }

//     comment.commentText = commentText;

//     fs.writeFileSync(
//         path.resolve("server", "mockData", "comments.json"),
//         JSON.stringify(comments)
//     );

//     res.status(200).json(comment);
// });

// // Delete comment
// app.delete("/api/comments/:commentId", (req, res) => {
//     const { commentId } = req.params;

//     const commentIndex = comments.findIndex((c) => c.commentId == commentId);

//     if (commentIndex === -1) {
//         return res.status(404).json({ error: "Comment not found" });
//     }

//     comments.splice(commentIndex, 1);

//     fs.writeFileSync(
//         path.resolve("server", "mockData", "comments.json"),
//         JSON.stringify(comments)
//     );

//     res.status(200).json({ message: "Comment deleted" });
// });

// // Delete proposal
// app.delete("/api/proposals/:proposalId", (req, res) => {
//     const { proposalId } = req.params;

//     const proposalIndex = proposals.findIndex(
//         (p) => p.proposalId == proposalId
//     );

//     if (proposalIndex === -1) {
//         return res.status(404).json({ error: "Proposal not found" });
//     }

//     proposals.splice(proposalIndex, 1);

//     fs.writeFileSync(
//         path.resolve("server", "mockData", "proposals.json"),
//         JSON.stringify(proposals)
//     );

//     res.status(200).json({ message: "Proposal deleted" });
// });




// Sync Database (Create tables if not exists)
const startServer = async () => {
    try {
        await sequelize.sync({ alter: true }); // Auto-sync models
        console.log("✅ Database synced!");
        app.listen(PORT, () =>
            console.log(`🚀 Server running on http://localhost:${PORT}`)
        );
    } catch (error) {
        console.error("❌ Failed to start server:", error);
    }
};

startServer();
