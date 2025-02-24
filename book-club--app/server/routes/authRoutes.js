import express from "express";
import {
    loginUser,
    logoutUser,
    refreshToken,
    getUserProfile,
} from "../controllers/userController.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

// Login Route
router.post("/users/login", loginUser);

// Logout Route
router.post("/users/logout", logoutUser);

// Refresh Token Route
router.post("/users/refresh", refreshToken);

// User Profile Route (Protected)
router.get("/users/me", authenticateToken, getUserProfile);

export default router;
