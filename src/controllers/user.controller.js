import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";


import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import ApiError from "../utils/ApiError.js";

// =====================================
// Get My Profile
// =====================================

export const getMyProfile = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Profile fetched successfully"
        )
    );

});

// =====================================
// Update Profile
// =====================================

export const updateProfile = asyncHandler(async (req, res) => {

    const {
        name,
        bio,
        interests,
        radius,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(

        req.user._id,

        {
            $set: {
                ...(name && { name }),
                ...(bio !== undefined && { bio }),
                ...(interests && { interests }),
                ...(radius && { radius }),
            },
        },

        {
            new: true,
            runValidators: true,
        }

    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Profile updated successfully"
        )
    );

});






// =====================================
// Update User Location
// =====================================


//' err


export const updateLocation = asyncHandler(async (req, res) => {

//err
console.log("req.body:", req.body);


    const {
        locationName,
        coordinates,
    } = req.body;

    if (
        !coordinates ||
        coordinates.length !== 2
    ) {
        throw new ApiError(
            400,
            "Valid coordinates are required"
        );
    }

    const updatedUser =
        await User.findByIdAndUpdate(

            req.user._id,

            {
                $set: {

                    locationName,

                    location: {
                        type: "Point",
                        coordinates,
                    },

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
            updatedUser,
            "Location updated successfully"
        )

    );

});


// =====================================
// Get Nearby Users
// =====================================

export const getNearbyUsers = asyncHandler(async (req, res) => {

    const radius = Math.min(
        Number(req.query.radius) || 50,
        60
    );

    const maxDistance = radius * 1000;

    const nearbyUsers = await User.find({

        _id: {
            $ne: req.user._id
        },

        location: {
            $near: {
                $geometry: req.user.location,
                $maxDistance: maxDistance
            }
        }

    })
    .select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(
            200,
            nearbyUsers,
            `Users within ${radius} km fetched successfully`
        )
    );

});

// =====================================
// Update Avatar
// =====================================

export const updateAvatar = asyncHandler(async (req, res) => {

    if (!req.file) {
        throw new ApiError(400, "Avatar image is required");
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
        req.file.buffer
    );

    const updatedUser = await User.findByIdAndUpdate(

        req.user._id,

        {
            $set: {
                avatar: result.secure_url,
            },
        },

        {
            new: true,
        }

    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Avatar updated successfully"
        )
    );

});




// =====================================
// Get All Users (except current user)
// =====================================

export const getAllUsers = asyncHandler(

    async (req, res) => {

        const users = await User.find({

            _id: {
                $ne: req.user._id,
            },

        }).select(

            "name avatar locationName isOnline lastSeen"

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                users,

                "Users fetched successfully"

            )

        );

    }

);