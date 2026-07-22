import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// =====================================
// Verify JWT Middleware
// =====================================

export const verifyJWT = asyncHandler(async (req, res, next) => {

    // Get token from cookies or Authorization header
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    // Verify token
    const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(decodedToken.id)
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(401, "Invalid access token");
    }

    // Attach user to request
    req.user = user;

    next();

});