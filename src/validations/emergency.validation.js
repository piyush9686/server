import { body, validationResult } from "express-validator";

// =====================================
// Create Emergency Validation
// =====================================

export const createEmergencyValidation = [

    body("type")
        .isIn([
            "medical",
            "fire",
            "theft",
            "accident",
            "missing_person",
            "suspicious_activity",
        ])
        .withMessage("Invalid emergency type"),

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title cannot exceed 100 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("visibilityRadius")
        .optional()
        .isIn([5, 10, 25, 50, 60])
        .withMessage("Invalid radius"),

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