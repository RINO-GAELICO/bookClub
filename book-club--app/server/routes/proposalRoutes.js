import express from "express";
import { getProposals, postProposal } from "../controllers/proposalController.js";
const router = express.Router();

// Post a new proposal
router.post("/proposal/post", postProposal);

// Get all proposals
router.get("/proposals", getProposals);

export default router;
