import express from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
    createPostValidation,
    validate,
    updatePostValidation
} from "../validations/post.validation.js";

import {
    createPost,
    getFeed,
    toggleLikePost,
    updatePost,
    deletePost,
} from "../controllers/post.controller.js";

const router = express.Router();

// =====================================
// Create Post
// =====================================

router.post(
    "/",
    verifyJWT,
    upload.array("images", 5), // ← NEW
    createPostValidation,
    validate,
    createPost
);

// =====================================
// Hyperlocal Feed
// =====================================

router.get(
    "/feed",
    verifyJWT,
    getFeed
);

// =====================================
// Like / Unlike Post
// =====================================

router.post(
    "/:id/like",
    verifyJWT,
    toggleLikePost
);

// =====================================
// Update Post
// =====================================

router.patch(
    "/:id",
    verifyJWT,
    updatePostValidation,
    validate,
    updatePost
);

// =====================================
// Delete Post
// =====================================

router.delete(
    "/:id",
    verifyJWT,
    deletePost
);

export default router;