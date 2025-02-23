import express from "express";
import { loginUser, logoutUser } from "../controllers/userController.js";

const router = express.Router();

// Login Route
router.post("/users/login", loginUser);

// Logout Route
router.post("/users/logout", logoutUser);

export default router;

