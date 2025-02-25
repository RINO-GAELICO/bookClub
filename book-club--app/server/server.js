import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import logger from "./logger.js";
import dotenv from "dotenv";
import { sequelize } from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import authRoutes from "./routes/authRoutes.js";



// Load environment variables from .env file (Docker will inject them)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));

app.use(express.json());
app.use(cookieParser());

// Authentication Routes
app.use("/api", authRoutes);

// Serve Static Files
app.use("/uploads", express.static("uploads"));

// Import routes
app.use("/api", userRoutes);
app.use("/api", proposalRoutes);
app.use("/api", commentRoutes);
app.use("/api", voteRoutes);

app.use(
    morgan("combined", {
        stream: {
            write: (message) => {
                logger.info(message.replace("::ffff:", "")); // Removes IPv6 prefix
                console.log(message.replace("::ffff:", "")); // Logs to console
            },
        },
    })
);

app.use((err, req, res) => {
    console.error(err.stack); // Logs error in the console
    logger.error(err.stack); // Logs error in the log file
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
});

// Sync Database (Create tables if not exists)
const startServer = async () => {
    try {
        await sequelize.sync({ alter: true }); // Auto-sync models
        console.log("✅ Database synced!");
        app.listen(PORT, () =>
            console.log(`🚀 Server running on http://localhost:${PORT}`)
        );
    } catch (error) {
        console.error("❌ Failed to start server:", error);
    }
};

startServer();
