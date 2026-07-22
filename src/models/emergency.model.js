import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(

    {

        // =====================================
        // Emergency Creator
        // =====================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, 




        reportForSomeoneElse: {
    type: Boolean,
    default: false,
},

contactName: {
    type: String,
    trim: true,
    maxlength: 100,
    default: "",
},

contactPhone: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "",
},

        // =====================================
        // Emergency Type
        // =====================================

        type: {
            type: String,
            enum: [
                "medical",
                "fire",
                "theft",
                "accident",
                "missing_person",
                "suspicious_activity",
            ],
            required: true,
        },

        // =====================================
        // Basic Details
        // =====================================

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        // =====================================
        // Location
        // =====================================

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

        // =====================================
        // Visibility
        // =====================================

        visibilityRadius: {

            type: Number,
            enum: [5, 10, 25, 50, 60],
            default: 10,

        },

        // =====================================
        // Status
        // =====================================

        status: {

            type: String,
            enum: [
                "active",
                "in_progress",
                "resolved",
            ],
            default: "active",

        },

        // =====================================
        // Priority
        // =====================================

        priority: {

            type: String,
            enum: [
                "low",
                "medium",
                "high",
                "critical",
            ],
            default: "medium",

        },

        // =====================================
        // Helpers
        // =====================================

        helpers: [

            {

                type: mongoose.Schema.Types.ObjectId,
                ref: "User",

            },

        ],

        // =====================================
        // Emergency Responses
        // =====================================

        responses: [

            {

                user: {

                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,

                },

                type: {

                    type: String,

                    enum: [

                        "coming",

                        "police",

                        "ambulance",

                        "fire",

                        "safe",

                    ],

                    required: true,

                },

                message: {

                    type: String,
                    trim: true,
                    default: "",

                },

                createdAt: {

                    type: Date,
                    default: Date.now,

                },

            },

        ],

        // =====================================
        // Live Tracking
        // =====================================

        liveTrackingEnabled: {

            type: Boolean,
            default: true,

        },

        // =====================================
        // Resolution
        // =====================================

        resolvedAt: {

            type: Date,
            default: null,

        },

        // =====================================
        // Soft Delete
        // =====================================

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
// Geo Index
// =====================================

emergencySchema.index({

    location: "2dsphere",

});

const Emergency = mongoose.model(

    "Emergency",

    emergencySchema

);

export default Emergency;