import express from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
    sendMessage,
   
    getConversations,
    getMessages,
    markMessagesAsRead,
} from "../controllers/message.controller.js";

import {
    sendMessageValidation,
} from "../validations/message.validation.js";

import {
    validate,
} from "../validations/auth.validation.js";

const router = express.Router();

// =====================================
// Send Message
// =====================================

router.post(
    "/send/:receiverId",
    verifyJWT,
    sendMessageValidation,
    validate,
    sendMessage
);

// =====================================
// Get Conversations
// =====================================

router.get(
    "/conversations",
    verifyJWT,
    getConversations
);


// =====================================
// Get Messages
// =====================================

router.get(
    "/:conversationId",
    verifyJWT,
    getMessages
);


// =====================================
// Mark Messages As Read
// =====================================

router.patch(
    "/read/:conversationId",
    verifyJWT,
    markMessagesAsRead
);
export default router;