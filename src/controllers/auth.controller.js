import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// =====================================
// Register User
// =====================================


export const registerUser = asyncHandler(async (req, res) => {

    const {
        name,
        email,
        password,
        bio,
        interests,
        radius,

        locationName,
        longitude,
        latitude,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(
            409,
            "User already exists with this email"
        );
    }

    // Create user
    const user = await User.create({

        name,
        email,
        password,
        bio,
        interests,

        radius: radius || 50,

        // Manual location
        locationName: locationName || "",

        // Map location
        location: {
            type: "Point",

            coordinates:
                longitude !== undefined &&
                latitude !== undefined
                    ? [Number(longitude), Number(latitude)]
                    : [0, 0], // [lng, lat]
        },

    });

    // Remove sensitive fields
    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(
            500,
            "Failed to create user"
        );
    }

    return res.status(201).json(

        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )

    );

});


// =====================================
// Login User
// =====================================

export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Remove sensitive fields
    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    // Send response
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "Login successful"
            )
        );

});


// =====================================
// Get Current User
// =====================================

export const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
    );

});



// =====================================
// Update Profile
// =====================================

export const updateProfile = asyncHandler(

    async (req, res) => {

        const {
            name,
            bio,
            interests,
            radius,
        } = req.body;

        const user =
            await User.findByIdAndUpdate(

                req.user._id,

                {
                    $set: {
                        name,
                        bio,
                        interests,
                        radius,
                    },
                },

                {
                    new: true,
                    runValidators: true,
                }

            ).select(
                "-password -refreshToken"
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                user,
                "Profile updated successfully"
            )

        );

    }

);





// =====================================
// Logout User
// =====================================

export const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
            new: true,
        }
    );

    const cookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(
                200,
                null,
                "Logout successful"
            )
        );

});


// =====================================
// Refresh Access Token
// =====================================

export const refreshAccessToken = asyncHandler(async (req, res) => {

    // Get refresh token from cookies or body
    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token required");
    }

    // Verify refresh token
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.JWT_REFRESH_SECRET
    );

    // Find user
    const user = await User.findById(decodedToken.id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    // Match token with DB
    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token mismatch");
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })
        .json(
            new ApiResponse(
                200,
                {
                    accessToken: newAccessToken,
                },
                "Access token refreshed successfully"
            )
        );

});