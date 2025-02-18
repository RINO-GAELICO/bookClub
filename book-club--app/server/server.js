import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import logger from "./logger.js";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

// Load environment variables from .env file (Docker will inject them)
dotenv.config();


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const users = JSON.parse(
    fs.readFileSync(path.resolve("server", "mockData/users.json"))
);
const comments = JSON.parse(
    fs.readFileSync(path.resolve("server", "mockData/comments.json"))
);
const proposals = JSON.parse(
    fs.readFileSync(path.resolve("server", "mockData/proposals.json"))
);
const proposalVotes = JSON.parse(
    fs.readFileSync(path.resolve("server", "mockData/proposalVotes.json"))
);

app.use(
  morgan("combined", {
      stream: {
          write: (message) => {
              console.log(message.replace("::ffff:", "")); // Removes IPv6 prefix
          },
      },
  })
);

app.use((err, req, res) => {
  console.error(err.stack); // Logs error in the console

  res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
  });
});

// Get all users
app.get("/api/users", (req, res) => {
    logger.info("Getting all users");
    res.json(users);
});

// Get a specific user by email or username (for login)
app.get("/api/users/login", (req, res) => {
    const { email, username, password } = req.query;

    // Access the 'users' array within the 'users' object
    const user = users.users.find(
        (u) =>
            (u.email === email || u.username === username) &&
            u.password === password
    );

    if (user) {
        res.json(user);
    } else {
        res.status(400).json({ error: "Invalid credentials" });
    }
});

// Register new user
app.post(
  "/api/users/register",
  [
      body("email").isEmail().withMessage("Invalid email format"),
      body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
      body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
      next();
  },
  (req, res) => {
      const { email, username, password } = req.body;

      const existingUser = users.users.find(
          (u) => u.email === email || u.username === username
      );

      if (existingUser) {
          return res.status(400).json({ error: "User already exists" });
      }

      const newUser = {
          userId: users.users.length + 1,
          email,
          username,
          password, // In real apps, hash this!
      };

      users.users.push(newUser);
      fs.writeFileSync(
          path.resolve("server", "mockData", "users.json"),
          JSON.stringify({ users: users.users })
      );

      res.status(201).json(newUser);
  }
);

// Get all comments
app.get("/api/comments", (req, res) => {
    res.json(comments);
});

// Get all comments by a user
// Route to get all comments for a specific user
app.get("/api/users/:userId/comments", (req, res) => {
  const { userId } = req.params;

  // Access the comments array correctly
  const userComments = comments.comments.filter((comment) => comment.userId == userId);

  res.json(userComments);
});


// Get all replies to a comment
app.get("/api/comments/:commentId/replies", (req, res) => {
    const { commentId } = req.params;

    const replies = comments.comments.filter((comment) => comment.replyTo == commentId);

    res.json(replies);
});

// GET all comments on a proposal
app.get("/api/proposals/:proposalId/comments", (req, res) => {
    const { proposalId } = req.params;

    const proposalComments = comments.comments.filter(
        (comment) => comment.proposalId == proposalId
    );

    res.json(proposalComments);
});

// Route to get all proposals
app.get("/api/proposals", (req, res) => {
    res.json(proposals);
});

// Route to get a specific proposal by id
app.get("/api/proposals/:proposalId", (req, res) => {
    const { proposalId } = req.params;
    const proposal = proposals.proposals.find((p) => p.id == proposalId);
    res.json(proposal);
});

// Route to get votes on a specific proposal
app.get("/api/proposals/:proposalId/votes", (req, res) => {
    const { proposalId } = req.params;
    const votes = proposalVotes.proposalVotes.filter((vote) => vote.proposalId == proposalId);
    res.json(votes);
});

// Get all proposals created by a specific user
app.get("/api/users/:userId/proposals", (req, res) => {
    const { userId } = req.params;

    const userProposals = proposals.proposals.filter(
        (proposal) => proposal.userId == userId
    );

    res.json(userProposals);
});

// Create a new proposal
app.post("/api/proposals", (req, res) => {
    const { userId, title, description } = req.body;

    const newProposal = {
        proposalId: proposals.proposals.length + 1, // Incremental proposalId
        userId,
        title,
        description,
        timestamp: new Date().toISOString(),
    };

    proposals.proposals.push(newProposal);
    fs.writeFileSync(
        path.resolve("server", "mockData", "proposals.json"),
        JSON.stringify(proposals)
    );

    res.status(201).json(newProposal);
});

// Create a new comment on a proposal
app.post("/api/proposals/:proposalId/comments", (req, res) => {
    const { proposalId } = req.params;
    const { userId, commentText } = req.body;

    const newComment = {
        commentId: comments.length + 1, // Incremental commentId
        userId,
        proposalId,
        commentText,
        timestamp: new Date().toISOString(),
        replyTo: null, // Optionally you can implement a reply functionality
    };

    comments.push(newComment);
    fs.writeFileSync(
        path.resolve("server", "mockData", "comments.json"),
        JSON.stringify(comments)
    );

    res.status(201).json(newComment);
});

// Reply to a comment
app.post("/api/comments/:commentId/reply", (req, res) => {
    const { commentId } = req.params;
    const { userId, replyText } = req.body;

    const comment = comments.find((c) => c.commentId == commentId);

    if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
    }

    const reply = {
        commentId: comments.length + 1, // Incremental commentId
        userId,
        commentText: replyText,
        timestamp: new Date().toISOString(),
        replyTo: commentId, // This is the comment this reply is in response to
    };

    comments.push(reply);
    fs.writeFileSync(
        path.resolve("server", "mockData", "comments.json"),
        JSON.stringify(comments)
    );

    res.status(201).json(reply);
});

// Vote on a proposal
app.post("/api/proposals/:proposalId/vote", (req, res) => {
    const { proposalId } = req.params;
    const { userId } = req.body;

    // Check if the user has already voted on this proposal
    const existingVote = proposalVotes.find(
        (vote) => vote.userId == userId && vote.proposalId == proposalId
    );

    if (existingVote) {
        return res
            .status(400)
            .json({ error: "You have already voted on this proposal" });
    }

    const newVote = {
        userId,
        proposalId,
    };

    proposalVotes.push(newVote);
    fs.writeFileSync(
        path.resolve("server", "mockData", "proposalVotes.json"),
        JSON.stringify(proposalVotes)
    );

    res.status(201).json(newVote);
});

// Get top voted proposals
app.get("/api/proposals/top", (req, res) => {
    const proposalVotesCount = {};

    proposalVotes.forEach((vote) => {
        proposalVotesCount[vote.proposalId] =
            (proposalVotesCount[vote.proposalId] || 0) + 1;
    });

    // Sort proposals by number of votes in descending order
    const topProposals = proposals
        .map((proposal) => ({
            ...proposal,
            votes: proposalVotesCount[proposal.proposalId] || 0,
        }))
        .sort((a, b) => b.votes - a.votes);

    res.json(topProposals);
});

// Channge vote on a proposal
app.put("/api/proposals/:proposalId/:userId/vote", (req, res) => {
    const { proposalId, userId } = req.params;

    const existingVote = proposalVotes.find(
        (vote) => vote.userId == userId && vote.proposalId == proposalId
    );

    if (!existingVote) {
        return res
            .status(400)
            .json({ error: "You have not voted on this proposal" });
    }

    const proposalVotesFiltered = proposalVotes.filter(
        (vote) => !(vote.userId == userId && vote.proposalId == proposalId)
    );

    fs.writeFileSync(
        path.resolve("server", "mockData", "proposalVotes.json"),
        JSON.stringify(proposalVotesFiltered)
    );

    res.status(200).json({ message: "Vote removed" });
});

// change comment
app.put("/api/comments/:commentId", (req, res) => {
    const { commentId } = req.params;
    const { commentText } = req.body;

    const comment = comments.find((c) => c.commentId == commentId);

    if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
    }

    comment.commentText = commentText;

    fs.writeFileSync(
        path.resolve("server", "mockData", "comments.json"),
        JSON.stringify(comments)
    );

    res.status(200).json(comment);
});

// Delete comment
app.delete("/api/comments/:commentId", (req, res) => {
    const { commentId } = req.params;

    const commentIndex = comments.findIndex((c) => c.commentId == commentId);

    if (commentIndex === -1) {
        return res.status(404).json({ error: "Comment not found" });
    }

    comments.splice(commentIndex, 1);

    fs.writeFileSync(
        path.resolve("server", "mockData", "comments.json"),
        JSON.stringify(comments)
    );

    res.status(200).json({ message: "Comment deleted" });
});

// Delete proposal
app.delete("/api/proposals/:proposalId", (req, res) => {
    const { proposalId } = req.params;

    const proposalIndex = proposals.findIndex((p) => p.proposalId == proposalId);

    if (proposalIndex === -1) {
        return res.status(404).json({ error: "Proposal not found" });
    }

    proposals.splice(proposalIndex, 1);

    fs.writeFileSync(
        path.resolve("server", "mockData", "proposals.json"),
        JSON.stringify(proposals)
    );

    res.status(200).json({ message: "Proposal deleted" });
});

// Initialize Sequelize (use the correct class name `Sequelize` with a capital S)
const sequelize = new Sequelize(
    process.env.DB_NAME, // Database name from .env file
    process.env.DB_USER, // Database user from .env file
    process.env.DB_PASSWORD, // Database password from .env file
    {
        host: process.env.DB_HOST || 'localhost', // Database host (use 'db' for Docker container)
        dialect: 'postgres',
        logging: false,
    }
);

// Sync Database (Create tables if not exists)
const startServer = async () => {
    try {
        await sequelize.sync({ alter: true }); // Auto-sync models
        console.log("✅ Database synced!");
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    } catch (error) {
        console.error("❌ Failed to start server:", error);
    }
};

startServer();