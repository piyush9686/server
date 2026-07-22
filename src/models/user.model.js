import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        avatar: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
            maxlength: 200,
        },

        interests: {
            type: [String],
            default: [],
        },


          locationName: {
    type: String,
    default: "",
},


        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
                default: [0, 0], // [longitude, latitude]
            },
        },

      
        radius: {
            type: Number,
            default: 50,
        },

        role: {
            type: String,
            enum: ["user", "business", "admin"],
            default: "user",
        },
        
        
        isVerified: {
            type: Boolean,
            default: false,
        },

        lastSeen: {
    type: Date,
    default: Date.now,
},

isOnline: {
    type: Boolean,
    default: false,
},

        trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
},

trustLevel: {
    type: String,
    enum: [
        "New Member",
        "Local Member",
        "Active Citizen",
        "Trusted Neighbor",
        "Community Champion"
    ],
    default: "New Member",
},




bookmarks:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LostFound",
    },
],

        refreshToken: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// ================================
// Geo Index
// ================================

userSchema.index({ location: "2dsphere" });

// ================================
// Hash Password Before Saving
// ================================

userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return ;
    }

    this.password = await bcrypt.hash(this.password, 10);

    

});

// ================================
// Compare Password
// ================================

userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);

};

// ================================
// Generate Access Token
// ================================

userSchema.methods.generateAccessToken = function () {

    return jwt.sign(
        {
            id: this._id,
            role: this.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );

};

// ================================
// Generate Refresh Token
// ================================

userSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
        {
            id: this._id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
        }
    );

};

const User = mongoose.model("User", userSchema);

export default User;