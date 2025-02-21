import express from "express";
import {
    postVote,
    getVotesByWeekController,
    getVotesByProposalController,
    getVotesByUserController,
 } from "../controllers/voteController.js";
const router = express.Router();

// post a vote
router.post("/proposals/:proposalId/vote", postVote);

// get votes by week
router.get("/votes/week/:week", getVotesByWeekController);

// get votes by proposal
router.get("/proposals/:proposalId/votes", getVotesByProposalController);

// get votes by user
router.get("/users/:userId/votes", getVotesByUserController);




export default router;