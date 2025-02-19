import express from "express";
import { getComments, postComment, getCommentsByUser, getReplies, getCommentsOnProposal } from "../controllers/commentController.js";
const router = express.Router();

// Get all comments
router.get("/comments", getComments);

// Post a comment on a proposal
router.post("/comment/post", postComment);

// Get all comments on a specific proposal
router.get("/comments/proposal/:proposalId", getCommentsOnProposal);

// Get all comments by a specific user
router.get("/comments/user/:userId", getCommentsByUser);

// Get all replies to a comment
router.get("/comments/:commentId/replies", getReplies);

export default router;
