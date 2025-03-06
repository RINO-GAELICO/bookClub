import {
    createProposal,
    getAllProposals,
    findProposalById,
    findProposalsByUser,
    removeProposal,
    findProposalsByWeek,
    getVotesByProposal,
} from "../services/dbService.js";
// import { generateThumbnail } from "../middleware/imageService.js";
import { uploadToGCS, generateThumbnail } from "../middleware/imageService.js";

import { getCurrentWeek } from "../utils.js";
import { Proposal } from "../models/Proposals.js";
import { io } from "../server.js";
import path from "path";

// Get all proposals
export const getProposals = async (req, res) => {
    try {
        const proposals = await getAllProposals();
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get proposals by week and user
export const getProposalsByCurrentWeek = async (req, res) => {
    const { userId } = req.query;

    const currentWeek = getCurrentWeek();

    try {
        const proposals = await findProposalsByWeek(currentWeek, userId);
        if (!proposals.length) {
            return res
                .status(404)
                .json({ error: "No proposals found for this week" });
        }
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get the most voted proposal of the week
export const getMostVotedProposal = async (req, res) => {
    const currentWeek = getCurrentWeek();

    try {
        const proposals = await findProposalsByWeek(currentWeek);
        for (const proposal of proposals) {
            const votes = await getVotesByProposal(proposal.id);
            proposal.dataValues.votes = votes.length;
        }

        const mostVoted = proposals.reduce((prev, current) =>
            (prev.dataValues.votes || 0) > (current.dataValues.votes || 0) ? prev : current
        );

        res.json(mostVoted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get a specific proposal by proposal id
export const getProposalById = async (req, res) => {
    const { proposalId } = req.params;
    const proposal = await findProposalById(proposalId);
    res.json(proposal);
};

// Get all proposals by a specific user
export const getProposalsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const proposals = await findProposalsByUser(userId);
        if (!proposals.length) {
            return res
                .status(404)
                .json({ error: "No proposals found for this user" });
        }
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Post a new proposal
export const postProposal = async (req, res) => {
    try {
        const { userId, title, description, author } = req.body;
        let imageUrl = null;
        let thumbnailUrl = null;

        if (req.file) {
            imageUrl = await uploadToGCS(req.file);
            thumbnailUrl = await generateThumbnail(req.file.buffer, req.file.originalname);
        }

        const week = getCurrentWeek();

        const proposal = await createProposal(
            userId,
            title,
            description,
            author,
            week,
            imageUrl,
            thumbnailUrl
        );

        io.emit("imageUpdated", { proposalId: proposal.id, imageUrl });

        return res.status(201).json(proposal);
    } catch (error) {
        console.error("Error creating proposal:", error);
        return res.status(500).json({ error: "Failed to create proposal" });
    }
};

export const updateProposal = async (req, res) => {
    const { proposalId } = req.params;
    const { title, description, author } = req.body;

    try {
        const proposal = await Proposal.findByPk(proposalId);
        if (!proposal) {
            return res.status(404).json({ error: "Proposal not found" });
        }

        let imageUrl = proposal.imageUrl;
        let thumbnailUrl = proposal.thumbnailUrl;

        if (req.file) {
            imageUrl = await uploadToGCS(req.file);
            thumbnailUrl = await generateThumbnail(req.file.buffer, req.file.originalname);
        }

        if (title) proposal.title = title;
        if (description) proposal.description = description;
        if (author) proposal.author = author;
        if (imageUrl) proposal.imageUrl = imageUrl;
        if (thumbnailUrl) proposal.thumbnailUrl = thumbnailUrl;

        await proposal.save();

        io.emit("imageUpdated", { proposalId, imageUrl });

        return res.status(200).json(proposal);
    } catch (error) {
        console.error("Error updating proposal:", error);
        return res.status(500).json({ error: "Failed to update proposal" });
    }
};

// Delete a proposal
export const deleteProposal = async (req, res) => {
    const { proposalId } = req.params;

    try {
        await removeProposal(proposalId);
        res.json({ message: "Proposal deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
