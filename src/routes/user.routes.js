import express from "express";



import { verifyJWT } from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";


import { getAllUsers } from "../controllers/user.controller.js";

import {
    getMyProfile,
    updateProfile,
    updateLocation,
    getNearbyUsers,
    updateAvatar,
} from "../controllers/user.controller.js";


import {
    updateProfileValidation,
    validate,
      updateLocationValidation,
      
} from "../validations/user.validation.js";





const router = express.Router();

// =====================================
// Get My Profile
// =====================================

router.get(
    "/me",
    verifyJWT,
    getMyProfile
);

router.patch(
    "/profile",
    verifyJWT,
    updateProfileValidation,
    validate,
    updateProfile
);

router.patch(
    "/location",
    verifyJWT,
    updateLocationValidation,
    validate,
    updateLocation
);




router.get(
    "/nearby",
    verifyJWT,
    getNearbyUsers
);
// =====================================
// Update Avatar
// =====================================

router.patch(
    "/avatar",
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
);

router.get(
    "/all",
    verifyJWT,
    getAllUsers
);

export default router;