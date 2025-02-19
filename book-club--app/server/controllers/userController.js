// controllers/userController.js
// Import services
import logger from "../logger.js";
import {
    getAllUsers,
    getUserByEmail,
    registerNewUser,
} from "../services/dbService.js";
import bcrypt from "bcryptjs";

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
    const { email, password } = req.query;

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare provided password with the hashed password in DB
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        logger.info(`User ${user.username} logged in`);

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
