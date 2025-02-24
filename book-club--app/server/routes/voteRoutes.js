import express from "express";
import {
    postVote,
    getVotesByWeekController,
    getVotesByProposalController,
    getVotesByUserController,
    updateVoteController,
 } from "../controllers/voteController.js";

import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

// post a vote
router.post("/proposals/:proposalId/vote", authenticateToken, postVote);

// get votes by week
router.get("/votes/week/:week", getVotesByWeekController);

// get votes by proposal
router.get("/proposals/:proposalId/votes", getVotesByProposalController);

// get votes by user
router.get("/users/:userId/votes", getVotesByUserController);

// change vote on a proposal
router.put("/votes/:userId/week/:week", authenticateToken, updateVoteController);



export default router;