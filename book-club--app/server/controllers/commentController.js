// Import services
import {
    getAllComments,
    createComment,
    getCommentsUser,
    getRepliesComment,
    getAllCommentsOnProposal,
} from "../services/dbService.js";

// Get all comments
export const getComments = async (req, res) => {
    try {
        const comments = await getAllComments();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Post a new comment on a proposal
export const postComment = async (req, res) => {
    const { userId, proposalId, content, replyTo } = req.body;

    try {
        const newComment = await createComment(
            userId,
            proposalId,
            content,
            replyTo || null
        );
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all comments created by a specific user
export const getCommentsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const comments = await getCommentsUser(userId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all replies to a comment
export const getReplies = async (req, res) => {
    const { commentId } = req.params;

    try {
        const replies = await getRepliesComment(commentId);
        res.json(replies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all comments on a specific proposal
export const getCommentsOnProposal = async (req, res) => {
    const { proposalId } = req.params;

    try {
        const comments = await getAllCommentsOnProposal(proposalId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
