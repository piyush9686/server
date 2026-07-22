import mongoose from "mongoose";

const postSchema = new mongoose.Schema(

    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        images: {
            type: [String],
            default: [],
        },

        category: {
            type: String,
            enum: [
                "general",
                "sports",
                "emergency",
                "business",
                "event",
                "announcement",
            ],
            default: "general",
        },

        visibilityRadius: {
            type: Number,
            enum: [5, 10, 25, 50, 60],
            default: 50,
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },

            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        commentsCount: {
            type: Number,
            default: 0,
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

// Geospatial Index
postSchema.index({
    location: "2dsphere",
});

const Post = mongoose.model("Post", postSchema);

export default Post;