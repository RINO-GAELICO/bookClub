// services/userService.js
import { User } from "../models/Users.js";
import { Comment } from "../models/Comments.js";
import { Proposal } from "../models/Proposals.js";
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
        return await User.findOne({ where: { email } });
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

export const getAllComments = async () => {
    try {
        const comments = await Comment.findAll();
        return comments;
    } catch (error) {
        throw new Error("❌ Error fetching comments: " + error.message);
    }
};

export const createComment = async (userId, proposalId, content, replyTo = null) => {
    try {
        return await Comment.create({
            userId,
            proposalId,
            content,
            replyTo,
        });
    } catch (error) {
        throw new Error("❌ Error posting comment: " + error.message);
    }
};

export const createProposal = async (userId, title, description, week) => {
    try {
        return await Proposal.create({
            userId,
            title,
            description,
            week
        });
    } catch (error) {
        throw new Error("❌ Error posting proposal: " + error.message);
    }
};

export const getAllProposals = async () => {
    try {
        const proposals = await Proposal.findAll();
        return proposals;
    } catch (error) {
        throw new Error("❌ Error fetching proposals: " + error.message);
    }
};

export const getCommentsUser = async (userId) => {
    try {
        return await Comment.findAll({ where: { userId } });
    } catch (error) {
        throw new Error("❌ Error fetching comments: " + error.message);
    }
}

// get Comments by proposalId
export const getCommentsByProposal = async (proposalId) => {
    try {
        return await Comment.findAll({ where: { proposalId } });
    } catch (error) {
        throw new Error("❌ Error fetching comments: " + error.message);
    }
}

// get Comments by commentID
export const getRepliesComment = async (commentId) => {
    try {
        return await Comment.findAll({ where: { replyTo: commentId } });
    } catch (error) {
        throw new Error("❌ Error fetching comments: " + error.message);
    }
}

// get Comments by proposalId
export const getAllCommentsOnProposal = async (proposalId) => {
    try {
        return await Comment.findAll({ where: { proposalId } });
    } catch (error) {
        throw new Error("❌ Error fetching comments: " + error.message);
    }
}

export const findProposalById = async (proposalId) => {
    try {
        return await Proposal.findOne({
            where: { id: proposalId },
        });
    } catch (error) {
        throw new Error("❌ Error fetching proposal: " + error.message);
    }
};

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
                    model: Proposal,  // Assuming you have a Proposal model
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
        throw new Error("❌ Error fetching votes by proposal: " + error.message);
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





