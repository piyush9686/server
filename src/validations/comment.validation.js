import { body, validationResult } from "express-validator";

// =====================================
// Create Comment Validation
// =====================================

export const createCommentValidation = [

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Comment is required")
        .isLength({ min: 1, max: 500 })
        .withMessage(
            "Comment must be between 1 and 500 characters"
        ),

];

// =====================================
// Validation Middleware
// =====================================

export const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: errors.array(),
        });

    }

    next();

};