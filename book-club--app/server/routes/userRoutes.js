// routes/userRoutes.js
import express from "express";
import { body } from "express-validator";
import { getUsers, registerUser } from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/users", getUsers);

// Register new user
router.post("/users/register", registerUser);

export default router;
