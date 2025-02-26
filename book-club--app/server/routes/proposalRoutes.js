import express from "express";
import { getProposals,
    postProposal,
    getProposalById,
    getProposalsByUser,
    updateProposal,
    deleteProposal,
    getProposalsByCurrentWeek
 } from "../controllers/proposalController.js";
import authenticateToken from "../middleware/authenticateToken.js";
import {upload} from "../middleware/imageService.js";

const router = express.Router();

// Post a new proposal
router.post("/proposal/post", authenticateToken, upload.single("image"), postProposal);

// Get all proposals
router.get("/proposals", getProposals);

// Get all proposals by a specific user
router.get("/proposals/user/:userId", getProposalsByUser);

// Get proposals by current week
router.get("/proposals/week", getProposalsByCurrentWeek);

// Get a specific proposal by ID
router.get("/proposals/:proposalId", getProposalById);

// Update a proposal
router.patch("/proposals/:proposalId", authenticateToken, upload.single("image"), updateProposal);

// Delete a proposal
router.delete("/proposals/:proposalId", deleteProposal);


export default router;
