import express from "express";
import { getProposals,
    postProposal,
    getProposalById,
    getProposalsByUser,
    updateProposal,
    deleteProposal
 } from "../controllers/proposalController.js";
const router = express.Router();

// Post a new proposal
router.post("/proposal/post", postProposal);

// Get all proposals
router.get("/proposals", getProposals);

// Get a specific proposal by ID
router.get("/proposals/:proposalId", getProposalById);

// Get all proposals by a specific user
router.get("/proposals/user/:userId", getProposalsByUser);

// Update a proposal
router.put("/proposals/:proposalId", updateProposal);

// Delete a proposal
router.delete("/proposals/:proposalId", deleteProposal);


export default router;
