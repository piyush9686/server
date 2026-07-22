import express from "express";

import {
    registerUser,
    loginUser,
    getCurrentUser,
     updateProfile,
    logoutUser,
    refreshAccessToken
} from "../controllers/auth.controller.js";

import {
    registerValidation,
    loginValidation,
    validate,
} from "../validations/auth.validation.js";



import { verifyJWT } from "../middleware/auth.middleware.js";


const router = express.Router();

// ==============================
// Register
// ==============================

router.post(
    "/register",
    ...registerValidation,
    validate,
    registerUser
);

// ==============================
// Login
// ==============================

router.post(
    "/login",
    ...loginValidation,
    validate,
    loginUser
);

export default router;


// ==============================
// Get Current User
// ==============================

router.get(
    "/me",
    verifyJWT,
    getCurrentUser
);


// ==============================
// Update Profile
// ==============================

router.patch(
    "/profile",
    verifyJWT,
    updateProfile
);

// ==============================
// Logout User
// ==============================

router.post(
    "/logout",
    verifyJWT,
    logoutUser
);

// ==============================
// Refresh Access Token
// ==============================

router.post(
    "/refresh-token",
    refreshAccessToken
);