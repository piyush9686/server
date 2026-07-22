import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(

    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: "",
        },

        attachments: [
            {
                type: String,
            },
        ],

        messageType: {
            type: String,
            enum: [
                "text",
                "image",
                "voice",
            ],
            default: "text",
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        readAt: {
            type: Date,
            default: null,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true,
    }

);

// =====================================
// Indexes
// =====================================

messageSchema.index({
    conversation: 1,
    createdAt: -1,
});

messageSchema.index({
    sender: 1,
});

const Message = mongoose.model(
    "Message",
    messageSchema
);

export default Message;