// routes/userRoutes.js
import express from "express";
import { body } from "express-validator";
import {
    getUsers,
    loginUser,
    registerUser,
    logoutUser
} from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/users", getUsers);

// Register new user
router.post(
    "/users/register",
    [
        body("email").isEmail().withMessage("Invalid email format"),
        body("username")
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characters"),
        body("password")
            .isLength({ min: 4 })
            .withMessage("Password must be at least 4 characters"),
    ],
    registerUser
);

export default router;
