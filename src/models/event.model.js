import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(

    {

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
            maxlength: 500,
        },
       
        eventImage: {
    type: String,
    default: "",
},
        

        category: {
            type: String,
            enum: [
                "badminton",
                "cricket",
                "football",
                "music",
                "study",
                "blood-donation",
                "community",
                "other",
            ],
            required: true,
        },

        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        maxParticipants: {
            type: Number,
            default: 10,
            min: 2,
        },

        eventDate: {
            type: Date,
            required: true,
        },

        visibilityRadius: {
            type: Number,
            default: 10, // km
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

        status: {
            type: String,
            enum: [
                "upcoming",
                "ongoing",
                "completed",
                "cancelled",
            ],
            default: "upcoming",
        },

    },

    {
        timestamps: true,
    }

);

// ================================
// Geo Index
// ================================

eventSchema.index({
    location: "2dsphere",
});

const Event = mongoose.model(
    "Event",
    eventSchema
);

export default Event;