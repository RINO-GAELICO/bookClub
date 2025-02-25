import { ProposalVote } from "../models/ProposalVote.js";
import {
    createVote,
    getVotesByWeek,
    getVotesByProposal,
    getVotesByUser,
    updateVote,
} from "../services/dbService.js";
import { getCurrentWeek } from "../utils.js";

// Function to create a vote
export const postVote = async (req, res) => {
    const { userId, proposalId } = req.body;
    const week = getCurrentWeek();

    try {
        await createVote(userId, proposalId, week);
        res.status(201).json({ message: "Vote created successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Function to get votes by week
export const getVotesByWeekController = async (req, res) => {
    // Get the current week
    const week = getCurrentWeek();

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
    const { userId, proposalId } = req.body;

    const week = getCurrentWeek();

    try {
        const vote = await ProposalVote.findOrCreate({
            where: { userId, week },
            defaults: { proposalId }, // Sets this if a new record is created
        });

        // If the vote already exists, update the proposalId
        if (!vote[1]) {
            await ProposalVote.update(
                { proposalId },
                {
                    where: { userId, week },
                }
            );
        }

        return res.status(200).json(vote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
