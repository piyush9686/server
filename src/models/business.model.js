import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(

    {

        // =====================================
        // Owner
        // =====================================

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // =====================================
        // Basic Information
        // =====================================

        name: {
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

        category: {
            type: String,
            enum: [
                "cafe",
                "restaurant",
                "grocery",
                "gym",
                "salon",
                "clinic",
                "coaching",
                "repair",
                "other",
            ],
            required: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        // =====================================
        // Business Banner
        // =====================================

        businessImage: {
            type: String,
            default: "",
        },

        // =====================================
        // Gallery
        // =====================================

        gallery: {
            type: [String],
            default: [],
        },

        // =====================================
        // Products
        // =====================================

        products: [

            {

                name: {
                    type: String,
                    required: true,
                    trim: true,
                },

                description: {
                    type: String,
                    default: "",
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },

                image: {
                    type: String,
                    default: "",
                },

                available: {
                    type: Boolean,
                    default: true,
                },
                views:{
                    type:Number,
                    default:0,
                }

            },

        ],

        // =====================================
        // Offers
        // =====================================

        offers: [

            {

                title: {
                    type: String,
                    required: true,
                    trim: true,
                },

                description: {
                    type: String,
                    default: "",
                },

                validTill: {
                    type: Date,
                },

            },

        ],

        // =====================================
        // Business Timings
        // =====================================

        openingTime: {
            type: String,
            default: "09:00",
        },

        closingTime: {
            type: String,
            default: "21:00",
        },

        isOpen: {
            type: Boolean,
            default: true,
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

                type: [Number],
                required: true,

            },

        },

        // =====================================
        // Visibility
        // =====================================

        visibilityRadius: {
            type: Number,
            default: 10,
            min: 1,
            max: 100,
        },

        // =====================================
        // Verification
        // =====================================

        isVerified: {
            type: Boolean,
            default: false,
        },

        // =====================================
        // Rating Summary
        // =====================================

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        totalReviews: {
            type: Number,
            default: 0,
        },


        views: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        viewedAt: {
            type: Date,
            default: Date.now,
        },
    },
],

        // =====================================
        // Customer Reviews
        // =====================================

        reviews: [

            {

                user: {

                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,

                },

                rating: {

                    type: Number,
                    required: true,
                    min: 1,
                    max: 5,

                },

                comment: {

                    type: String,
                    trim: true,
                    maxlength: 500,
                    default: "",

                },

                createdAt: {

                    type: Date,
                    default: Date.now,

                },

            },

        ],

    },

    {

        timestamps: true,

    }

);

// =====================================
// Geo Index
// =====================================

businessSchema.index({

    location: "2dsphere",

});

// =====================================
// One User = One Business (MVP)
// Remove later if users can own multiple businesses
// =====================================

businessSchema.index(

    { owner: 1 },

    { unique: true }

);

const Business = mongoose.model(

    "Business",

    businessSchema

);

export default Business;