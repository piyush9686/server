import { body, validationResult } from "express-validator";
import upload from "../middleware/upload.middleware.js";

// =====================================
// Update Profile Validation
// =====================================

export const updateProfileValidation = [

    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),

    body("bio")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("Bio cannot exceed 200 characters"),

    body("interests")
        .optional()
        .isArray()
        .withMessage("Interests must be an array"),

    body("radius")
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
// Update Location Validation
// =====================================

// export const updateLocationValidation = [

//     body("longitude")
//         .notEmpty()
//         .withMessage("Longitude is required")
//         .isFloat({ min: -180, max: 180 })
//         .withMessage("Invalid longitude"),

//     body("latitude")
//         .notEmpty()
//         .withMessage("Latitude is required")
//         .isFloat({ min: -90, max: 90 })
//         .withMessage("Invalid latitude"),

// ];

export const updateLocationValidation = [
    body("locationName")
        .optional()
        .isString(),

    body("coordinates")
        .isArray({ min: 2, max: 2 })
        .withMessage("Coordinates must be an array with longitude and latitude"),
];