
import {
    createProposal,
    getAllProposals,
    findProposalById,
    findProposalsByUser
} from "../services/dbService.js";



// Post a new proposal
export const postProposal = async (req, res) => {
    const { userId, title, description, week } = req.body;

    try {
        const newProposal = await createProposal(userId, title, description, week);
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

