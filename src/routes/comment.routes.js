import express from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
    createComment,
} from "../controllers/comment.controller.js";

import {
    createCommentValidation,
    validate,
} from "../validations/comment.validation.js";

const router = express.Router();

// =====================================
// Create Comment
// =====================================

router.post(
    "/:id/comments",
    verifyJWT,
    createCommentValidation,
    validate,
    createComment
);

export default router;