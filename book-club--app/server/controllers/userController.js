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

        console.log("User logged in successfully");

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        console.log(`Token: ${token}`);

        logger.info(`User ${user.username} logged in`);

        // Send token in a secure HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000, // 1 hour
        });

        // Send user data **without password**
        res.json({
            userId: user.id,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

// Logout user
export const logoutUser = (req, res) => {
    if (!req.cookies.token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
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
