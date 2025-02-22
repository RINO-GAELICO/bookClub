import {
    createVote,
    getVotesByWeek,
    getVotesByProposal,
    getVotesByUser,
    updateVote,
} from "../services/dbService.js";

// Function to create a vote
export const postVote = async (req, res) => {
    const { userId, proposalId, week } = req.body;

    try {
        await createVote(userId, proposalId, week);
        res.status(201).json({ message: "Vote created successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Function to get votes by week
export const getVotesByWeekController = async (req, res) => {
    const { week } = req.params;

    try {
        const votes = await getVotesByWeek(week);
        res.json(votes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Function to get votes by proposal
export const getVotesByProposalController = async (req, res) => {
    const { proposalId } = req.params;

    try {
        const votes = await getVotesByProposal(proposalId);
        res.json(votes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Function to get votes by user
export const getVotesByUserController = async (req, res) => {
    const { userId } = req.params;

    try {
        const votes = await getVotesByUser(userId);
        res.json(votes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Function to update a vote
export const updateVoteController = async (req, res) => {
    const { userId, week } = req.params;
    const { proposalId } = req.body;

    try {
        const updatedVote = await updateVote(userId, proposalId, week);
        res.json({ message: "Vote updated successfully", vote: updatedVote });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
