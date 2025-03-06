// controllers/userController.js
// Import services
import logger from "../logger.js";
import { getAllUsers, getUserByEmail } from "../services/dbService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/Users.js";
import { generateThumbnail } from "../middleware/imageService.js";
import path from "path";

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

        const { accessToken, refreshToken } = getAccesAndRefreshToken(user);

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
            userId: user.userId,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
};

export const getAccesAndRefreshToken = (user) => {
    // Generate Access Token (Short-lived)
    const accessToken = jwt.sign(
        { userId: user.userId, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "60m" }
    );

    // Generate Refresh Token (Long-lived)
    const refreshToken = jwt.sign(
        { userId: user.userId, username: user.username },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
};

export const refreshToken = (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res
            .status(401)
            .json({ error: "Unauthorized: No refresh token" });
    }

    try {
        // Verify Refresh Token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // Generate New Access Token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId, username: decoded.username },
            process.env.JWT_SECRET,
            { expiresIn: "60m" }
        );

        res.json({
            accessToken: newAccessToken,
            userId: decoded.userId,
            username: decoded.username,
        });
    } catch (error) {
        return res
            .status(403)
            .json({ error: "Forbidden: Invalid refresh token" });
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
        res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
};

// Logout user
export const logoutUser = (req, res) => {
    if (!req.cookies.refreshToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
    });
    res.json({ message: "Logged out successfully" });
};

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Debugging: Check received values
        console.log("Received data:", req.body);

        // Ensure email lookup is correct
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use." });
        }

        let avatar = null;
        if (req.file) {
            // Upload the original file to GCS
            const imageUrl = await uploadToGCS(req.file);

            // Generate a thumbnail using the image buffer
            avatar = await generateThumbnail(req.file.buffer, req.file.originalname);
        }

        // Create and save the new user
        const newUser = await User.create({
            username,
            email,
            password,
            avatar,
        });

        const { accessToken, refreshToken } = getAccesAndRefreshToken(newUser);

        logger.info(`User ${newUser.username} logged in`);

        // Store Refresh Token in HTTP-only Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send Access Token in response (not in cookie)
        res.status(201).json({
            accessToken,
            userId: newUser.userId,
            username: newUser.username,
            email: newUser.email,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

