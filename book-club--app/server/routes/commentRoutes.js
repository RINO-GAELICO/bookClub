import express from "express";
import {
    getComments,
    postComment,
    getCommentsByUser,
    getReplies,
    getCommentsOnProposal,
    updateComment,
    deleteComment,
 } from "../controllers/commentController.js";
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

// Change a comment
router.put("/comment/:commentId", updateComment);

// Delete a comment
router.delete("/comment/:commentId", deleteComment);

export default router;
