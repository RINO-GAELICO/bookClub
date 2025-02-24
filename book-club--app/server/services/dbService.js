// services/userService.js
import { User } from "../models/Users.js";
import { Comment } from "../models/Comments.js";
import { Proposal } from "../models/Proposals.js";
import { ProposalVote } from "../models/ProposalVote.js";
// import { Op } from "sequelize";
import bcrypt from "bcryptjs";

export const getAllUsers = async () => {
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        throw new Error("❌ Error fetching users: " + error.message);
    }
};

export const getUserByEmail = async (email) => {
    try {
        return await User.findOne({
            where: { email },
            attributes: ["userId", "username", "email", "password"],
        });
    } catch (error) {
        throw new Error(`❌ Error fetching user: ${error.message}`);
    }
};

export const registerNewUser = async (email, username, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        return await User.create({
            email,
            username,
            password: hashedPassword,
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new Error("Email or username already exists");
        }
        throw error;
    }
};

// Function to get all comments
export const getAllComments = async () => {
    try {
        const comments = await Comment.findAll();
        return comments;
    } catch (error) {
        throw new Error("❌ Error fetching comments: " + error.message);
    }
};

// Function to create a comment
export const createComment = async (
    userId,
    proposalId,
    content,
    replyTo = null
) => {
    try {
        // Create the comment
        const newComment = await Comment.create({
            userId,
            proposalId,
            content,
            replyTo,
        });

        // Fetch the comment with the associated user (to get the username)
        const createdCommentWithUser = await Comment.findOne({
            where: { id: newComment.id },
            include: [
                {
                    model: User,
                    as: "User",
                    required: true,
                    attributes: ["userId", "username"],
                },
            ],
        });

        return createdCommentWithUser; // Return the comment with user info
    } catch (error) {
        throw new Error("❌ Error posting comment: " + error.message);
    }
};

// Function to create a proposal
export const createProposal = async (userId, title, description, week) => {
    try {
        return await Proposal.create({
            userId,
            title,
            description,
            week,
        });
    } catch (error) {
        throw new Error("❌ Error posting proposal: " + error.message);
    }
};

// Function to get all proposals
export const getAllProposals = async () => {
    try {
        const proposals = await Proposal.findAll();
        return proposals;
    } catch (error) {
        throw new Error("❌ Error fetching proposals: " + error.message);
    }
};

// Function to find a proposal by week
export const findProposalsByWeek = async (week, userId) => {
    try {
        return await Proposal.findAll({
            where: { week, userId },
        });
    } catch (error) {
        throw new Error("❌ Error fetching proposals: " + error.message);
    }
};

// Function to get all comments by user
export const getCommentsUser = async (userId) => {
    try {
        return await Comment.findAll({ where: { userId } });
    } catch (error) {
        throw new Error("❌ Error fetching comments: " + error.message);
    }
};

// get Comments by commentID
export const getRepliesComment = async (commentId) => {
    try {
        return await Comment.findAll({ where: { replyTo: commentId } });
    } catch (error) {
        throw new Error("❌ Error fetching comments: " + error.message);
    }
};

// get Comments by proposalId
export const getAllCommentsOnProposal = async (proposalId) => {
    try {
        return await Comment.findAll({
            where: { proposalId },
            include: [
                {
                    model: User,
                    as: "User",
                    required: true,
                    attributes: ["userId", "username"],
                },
            ],
        });
    } catch (error) {
        throw new Error("❌ Error fetching comments: " + error.message);
    }
};

// Function to find a comment by ID
export const findProposalById = async (proposalId) => {
    try {
        return await Proposal.findOne({
            where: { id: proposalId },
        });
    } catch (error) {
        throw new Error("❌ Error fetching proposal: " + error.message);
    }
};

// Function to find proposals by user
export const findProposalsByUser = async (userId) => {
    try {
        return await Proposal.findAll({
            where: { userId },
        });
    } catch (error) {
        throw new Error("❌ Error fetching proposals: " + error.message);
    }
};

// Function to create a vote
export const createVote = async (userId, proposalId, week) => {
    try {
        // Check if user has already voted in the given week
        const existingVote = await ProposalVote.findOne({
            where: {
                userId,
                week,
            },
        });

        if (existingVote) {
            throw new Error("❌ User has already voted this week.");
        }

        // Create a new vote
        return await ProposalVote.create({
            userId,
            proposalId,
            week,
        });
    } catch (error) {
        throw new Error("❌ Error posting vote: " + error.message);
    }
};

// Function to get votes by week
export const getVotesByWeek = async (week) => {
    try {
        return await ProposalVote.findAll({
            where: {
                week,
            },
            include: [
                {
                    model: Proposal,
                    required: true,
                },
            ],
        });
    } catch (error) {
        throw new Error("❌ Error fetching votes by week: " + error.message);
    }
};

// Function to get votes by proposal
export const getVotesByProposal = async (proposalId) => {
    try {
        return await ProposalVote.findAll({
            where: {
                proposalId,
            },
        });
    } catch (error) {
        throw new Error(
            "❌ Error fetching votes by proposal: " + error.message
        );
    }
};

// Function to get votes by user
export const getVotesByUser = async (userId) => {
    try {
        return await ProposalVote.findAll({
            where: {
                userId,
            },
        });
    } catch (error) {
        throw new Error("❌ Error fetching votes by user: " + error.message);
    }
};

// Function to update a vote
export const updateVote = async (userId, proposalId, week) => {
    try {
        try {
            const [updatedRows] = await ProposalVote.update(
                { proposalId },
                { where: { userId, week } }
            );

            if (updatedRows === 0) {
                throw new Error(
                    "❌ No existing vote found for this user in the given week."
                );
            }
            const updatedVote = await ProposalVote.findOne({
                where: { userId, week },
            });
            return updatedVote;
        } catch (error) {
            throw new Error("❌ Error updating vote: " + error.message);
        }
    } catch (error) {
        throw new Error("❌ Error updating vote: " + error.message);
    }
};

// Function to update a comment
export const changeComment = async (commentId, content) => {
    try {
        const [updatedRows] = await Comment.update(
            { content },
            { where: { id: commentId } }
        );

        if (updatedRows === 0) {
            throw new Error("❌ No existing comment found with this ID.");
        }

        const updatedComment = await Comment.findOne({
            where: { id: commentId },
        });
        return updatedComment;
    } catch (error) {
        throw new Error("❌ Error updating comment: " + error.message);
    }
};

// Function to delete a comment
export const removeComment = async (commentId) => {
    try {
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            throw new Error("❌ Comment not found.");
        }

        await comment.destroy();
    } catch (error) {
        throw new Error("❌ Error deleting comment: " + error.message);
    }
};

// Function to update a proposal
export const changeProposal = async (proposalId, title, description, week) => {
    try {
        const [updatedRows] = await Proposal.update(
            { title, description, week },
            { where: { id: proposalId } }
        );

        if (updatedRows === 0) {
            throw new Error("❌ No existing proposal found with this ID.");
        }

        const updatedProposal = await Proposal.findOne({
            where: { id: proposalId },
        });
        return updatedProposal;
    } catch (error) {
        throw new Error("❌ Error updating proposal: " + error.message);
    }
};

// Function to delete a proposal
export const removeProposal = async (proposalId) => {
    try {
        const proposal = await Proposal.findByPk(proposalId);
        if (!proposal) {
            throw new Error("❌ Proposal not found.");
        }

        await proposal.destroy();
    } catch (error) {
        throw new Error("❌ Error deleting proposal: " + error.message);
    }
};
