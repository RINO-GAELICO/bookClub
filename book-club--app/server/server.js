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
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

// Load environment variables from .env file (Docker will inject them)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup first (before routes)
app.use(cors({
    // origin: "http://localhost:5173",
    origin: "*", // Allow all origins
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

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

// Authentication Routes
app.use("/api", authRoutes);

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads/thumbnails", express.static(path.join(process.cwd(), "uploads/thumbnails")));

// Import routes
app.use("/api", userRoutes);
app.use("/api", proposalRoutes);
app.use("/api", commentRoutes);
app.use("/api", voteRoutes);

// Create HTTP server for Socket.IO integration
const server = createServer(app);

// Set up WebSocket server (after Express and middleware)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow your frontend
        methods: ["GET", "POST"],
    },
});

// Debugging connection
console.log('Socket.IO server is initialized and waiting for connections...');

// Listen for WebSocket connections
io.on("connection", (socket) => {
    console.log("User connected:", socket.id); // Logs connection event

    // socket.on("join", (week) => {
    //     socket.join(week);
    //     console.log(`User ${socket.id} joined room: ${week}`);
    // });

    // socket.on("leave", (week) => {
    //     socket.leave(week);
    //     console.log(`User ${socket.id} left room: ${week}`);
    // });

    // When user disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id); // Logs disconnection event
    });
});

// Export io for use in controllers
export { io };

// Sync Database (Create tables if not exists)
const startServer = async () => {
    try {
        await sequelize.sync({ alter: true }); // Auto-sync models
        console.log("✅ Database synced!");

        // Now start the server
        server.listen(PORT,"0.0.0.0", () => {
            console.log(`Server running on http://0.0.0.0:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
    }
};

startServer();
