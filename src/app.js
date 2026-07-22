import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import emergencyRoutes from "./routes/emergency.routes.js";
import messageRoutes from "./routes/message.routes.js";
import onlineRoutes from "./routes/online.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import eventRoutes from "./routes/event.routes.js";
import businessRoutes from "./routes/business.routes.js";

import errorHandler from "./middleware/error.middleware.js";

import lostFoundRoutes from "./routes/lostFound.routes.js";

const app = express();

// ======================================
// CORS CONFIGURATION
// ======================================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://frontend-phi-sepia-29.vercel.app"
        ],
        credentials: true,
    })
);

// ======================================
// MIDDLEWARES
// ======================================

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

// ======================================
// ROOT ROUTES
// ======================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LocalConnect API is running 🚀",
    });
});

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LocalConnect API is healthy",
        version: "v1",
    });
});

// ======================================
// API ROUTES
// ======================================

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/posts", postRoutes);

app.use("/api/v1/posts", commentRoutes);

app.use(
    "/api/v1/emergencies",
    emergencyRoutes
);

app.use(
    "/api/v1/messages",
    messageRoutes
);

app.use(
    "/api/v1/users",
    onlineRoutes
);

app.use(
    "/api/v1/notifications",
    notificationRoutes
);

app.use(
    "/api/v1/events",
    eventRoutes
);

app.use(
    "/api/v1/businesses",
    businessRoutes
);

app.use(
    "/api/v1/lost-found",
    lostFoundRoutes
);

// ======================================
// ERROR HANDLER
// ======================================

app.use(errorHandler);

export default app;