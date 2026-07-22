import { body, validationResult } from "express-validator";

// =====================================
// Create Post Validation
// =====================================

export const createPostValidation = [

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ min: 3, max: 1000 })
        .withMessage("Content must be between 3 and 1000 characters"),

    body("category")
        .optional()
        .isIn([
            "general",
            "sports",
            "emergency",
            "business",
            "event",
            "announcement"
        ])
        .withMessage("Invalid category"),

    body("visibilityRadius")
        .optional()
        .isIn([5, 10, 25, 50, 60])
        .withMessage("Radius must be 5, 10, 25, 50, or 60 km"),

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

// =====================================
// Update Post Validation
// =====================================

export const updatePostValidation = [

    body("content")
        .optional()
        .trim()
        .isLength({ min: 3, max: 1000 })
        .withMessage(
            "Content must be between 3 and 1000 characters"
        ),

    body("category")
        .optional()
        .isIn([
            "general",
            "sports",
            "emergency",
            "business",
            "event",
            "announcement",
        ])
        .withMessage("Invalid category"),

];