import { Server } from "socket.io";
import User from "../models/user.model.js";

let io;

// userId -> socketId
const onlineUsers = new Map();

export const initializeSocket = (server) => {

    io = new Server(server, {

        cors: {
            origin: "https://frontend-phi-sepia-29.vercel.app",
            credentials: true,
        },

    });

    io.on("connection", (socket) => {

        console.log(`🟢 Connected: ${socket.id}`);

        // =====================================
        // User joins with their ID
        // =====================================

        socket.on("join", async (userId) => {

    onlineUsers.set(userId, socket.id);

    socket.join(userId);

    await User.findByIdAndUpdate(userId, {
        isOnline: true,
    });

    io.emit("userOnline", userId);

    console.log(`👤 User ${userId} joined`);

});

        // =====================================
        // User Typing
        // =====================================

        socket.on(
            "typing",
            ({ receiverId, senderName }) => {

                io.to(receiverId).emit(
                    "userTyping",
                    {
                        senderName,
                    }
                );

            }
        );

        // =====================================
        // User Stopped Typing
        // =====================================

        socket.on(
            "stopTyping",
            ({ receiverId }) => {

                io.to(receiverId).emit(
                    "userStoppedTyping"
                );

            }
        );

        // =====================================
        // Disconnect
        // =====================================

        socket.on("disconnect", async() => {

             for (const [userId, socketId] of onlineUsers.entries()) {

                 if (socketId === socket.id) {

                   onlineUsers.delete(userId);

                await User.findByIdAndUpdate(userId, {

                isOnline: false,

                lastSeen: new Date(),

            });

            io.emit("userOffline", {

                userId,

                lastSeen: new Date(),

            });

            console.log(`👤 User ${userId} left`);

            break;

                }

            }

            console.log(`🔴 Disconnected: ${socket.id}`);

        });

    });

};

// =====================================
// Get IO Instance
// =====================================

export const getIO = () => {

    if (!io) {
        throw new Error("Socket.io not initialized");
    }

    return io;

};

// =====================================
// Get Online Users
// =====================================

export const getOnlineUsers = () => {

    return onlineUsers;

};