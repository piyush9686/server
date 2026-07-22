import mongoose from "mongoose";

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getIO } from "../sockets/index.js";


// =====================================
// Send Message
// =====================================

export const sendMessage = asyncHandler(

    async (req, res) => {

        const { receiverId } = req.params;

        const { content } = req.body;

        const senderId = req.user._id;

        // Prevent self-chat
        if (
            senderId.toString() ===
            receiverId.toString()
        ) {

            throw new ApiError(
                400,
                "You cannot send messages to yourself"
            );

        }

        // Find existing conversation
        let conversation =
            await Conversation.findOne({

                participants: {
                    $all: [
                        senderId,
                        receiverId,
                    ],
                },

                isGroup: false,

            });

        // Create conversation if not found
        if (!conversation) {

            conversation =
                await Conversation.create({

                    participants: [
                        senderId,
                        receiverId,
                    ],

                });

        }

        // Create message
        const message =
            await Message.create({

                conversation:
                    conversation._id,

                sender: senderId,

                content,

            });

        // Update conversation
        conversation.lastMessage =
            content;

        conversation.lastMessageAt =
            new Date();

        await conversation.save();

        // Populate sender details
        const createdMessage =
            await Message.findById(
                message._id
            ).populate(
                "sender",
                "name avatar"
            );

        // ==========================
        // Real-time Socket Event
        // ==========================

        const io = getIO();

        io.to(receiverId).emit(
            "newMessage",
            createdMessage
        );

        // ==========================
        // Response
        // ==========================

        return res.status(201).json(

            new ApiResponse(
                201,
                createdMessage,
                "Message sent successfully"
            )

        );

    }

);


// =====================================
// Get User Conversations
// =====================================

export const getConversations = asyncHandler(

    async (req, res) => {

        const conversations = await Conversation.find({

            participants: req.user._id,

        })

            .populate(
                "participants",
                "name avatar isOnline lastSeen"
            )

            .sort({
                lastMessageAt: -1,
            });

        const conversationsWithUnread = await Promise.all(

            conversations.map(async (conversation) => {

                const unreadCount =
                    await Message.countDocuments({

                        conversation: conversation._id,

                        sender: {
                            $ne: req.user._id,
                        },

                        isRead: false,

                    });

                return {

                    ...conversation.toObject(),

                    unreadCount,

                };

            })

        );

        return res.status(200).json(

            new ApiResponse(
                200,
                conversationsWithUnread,
                "Conversations fetched successfully"
            )

        );

    }

);


// =====================================
// Get Messages
// =====================================

export const getMessages = asyncHandler(

    async (req, res) => {

        const { conversationId } = req.params;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const skip = (page - 1) * limit;

        // Check conversation exists
        const conversation = await Conversation.findById(
            conversationId
        );

        if (!conversation) {
            throw new ApiError(
                404,
                "Conversation not found"
            );
        }

        // Security check
        const isParticipant =
            conversation.participants.some(
                participant =>
                    participant.toString() ===
                    req.user._id.toString()
            );

        if (!isParticipant) {
            throw new ApiError(
                403,
                "Access denied"
            );
        }

        const messages = await Message.find({

            conversation: conversationId,

            isDeleted: false,

        })

            .populate(
                "sender",
                "name avatar"
            )

            .sort({
                createdAt: -1,
            })

            .skip(skip)

            .limit(limit);

        const totalMessages =
            await Message.countDocuments({

                conversation: conversationId,

                isDeleted: false,

            });

        return res.status(200).json(

            new ApiResponse(

                200,

                {
                    messages,
                    page,
                    limit,
                    totalPages: Math.ceil(
                        totalMessages / limit
                    ),
                    totalMessages,
                },

                "Messages fetched successfully"

            )

        );

    }

);


// =====================================
// Mark Messages as Read
// =====================================

export const markMessagesAsRead = asyncHandler(

    async (req, res) => {

        const { conversationId } = req.params;

        // Verify conversation exists
        const conversation = await Conversation.findById(
            conversationId
        );

        if (!conversation) {
            throw new ApiError(
                404,
                "Conversation not found"
            );
        }

        // Security check
        const isParticipant =
            conversation.participants.some(
                participant =>
                    participant.toString() ===
                    req.user._id.toString()
            );

        if (!isParticipant) {
            throw new ApiError(
                403,
                "Access denied"
            );
        }

        // Mark unread messages as read
        const result = await Message.updateMany(

            {
                conversation: conversationId,

                sender: {
                    $ne: req.user._id
                },

                isRead: false,
            },

            {
                $set: {
                    isRead: true,
                    readAt: new Date(),
                },
            }

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                {
                    modifiedCount:
                        result.modifiedCount,
                },

                "Messages marked as read"

            )

        );

    }

);