// controllers/userController.js
// Import services
import logger from "../logger.js";
import {
    getAllUsers,
    getUserByEmail,
    registerNewUser,
} from "../services/dbService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate Access Token (Short-lived)
        const accessToken = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Generate Refresh Token (Long-lived)
        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        logger.info(`User ${user.username} logged in`);

        // Store Refresh Token in HTTP-only Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send Access Token in response (not in cookie)
        res.json({
            accessToken,
            userId: user.id,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

export const refreshToken = (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ error: "Unauthorized: No refresh token" });
    }

    try {
        // Verify Refresh Token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Generate New Access Token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ error: "Forbidden: Invalid refresh token" });
    }
};

// Get the profile of the currently logged-in user
export const getUserProfile = (req, res) => {
    try {
        // `req.user` will be set by the authentication middleware if the token is valid
        res.json({
            userId: req.user.userId,
            username: req.user.username,
            email: req.user.email,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};


// Logout user
export const logoutUser = (req, res) => {
    if (!req.cookies.refreshToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Strict" });
    res.json({ message: "Logged out successfully" });
};


// Register new user
export const registerUser = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const newUser = await registerNewUser(email, username, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
