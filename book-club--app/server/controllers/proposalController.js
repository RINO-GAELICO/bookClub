
import {
    createProposal,
    getAllProposals,
} from "../services/dbService.js";



// Post a new proposal
export const postProposal = async (req, res) => {
    const { userId, title, description } = req.body;

    try {
        const newProposal = await createProposal(userId, title, description);
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
