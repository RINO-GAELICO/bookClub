
import {
    createProposal,
    getAllProposals,
    findProposalById,
    findProposalsByUser,
    removeProposal,
    findProposalsByWeek

} from "../services/dbService.js";

import { getCurrentWeek } from "../utils.js";
import { Proposal } from "../models/Proposals.js";



// Post a new proposal
export const postProposal = async (req, res) => {
    const { userId, title, description, author } = req.body;

    // Get the current week
    const week = getCurrentWeek();

    try {
        const newProposal = await createProposal(userId, title, description, author, week);
        res.status(201).json(newProposal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

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
            return res.status(404).json({ error: "No proposals found for this week" });
        }
        res.json(proposals);
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
            return res.status(404).json({ error: "No proposals found for this user" });
        }
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a proposal
export const updateProposal = async (req, res) => {
    const { proposalId } = req.params;
    const { title, description, author } = req.body;

    try {
        const proposal = await Proposal.findByPk(proposalId);

        if (!proposal) {
            return res.status(404).json({ error: "Proposal not found" });
        }

        // Only update the fields that are provided in the request
        if (title !== undefined) proposal.title = title;
        if (description !== undefined) proposal.description = description;
        if (author !== undefined) proposal.author = author;

        await proposal.save(); // Save changes

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

