import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(

    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],

        lastMessage: {
            type: String,
            default: "",
        },

        lastMessageAt: {
            type: Date,
            default: Date.now,
        },

        isGroup: {
            type: Boolean,
            default: false,
        },

        groupName: {
            type: String,
            default: "",
        },

        groupAvatar: {
            type: String,
            default: "",
        },
    },

    {
        timestamps: true,
    }

);

// Index for faster participant lookup
conversationSchema.index({
    participants: 1,
});

const Conversation = mongoose.model(
    "Conversation",
    conversationSchema
);

export default Conversation;