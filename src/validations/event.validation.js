import { body } from "express-validator";

export const createEventValidation = [

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
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("category")
        .isIn([
            "badminton",
            "cricket",
            "football",
            "music",
            "study",
            "blood-donation",
            "community",
            "other",
        ])
        .withMessage("Invalid category"),

    body("eventDate")
        .isISO8601()
        .withMessage("Invalid event date"),

    body("maxParticipants")
        .optional()
        .isInt({ min: 2, max: 100 })
        .withMessage("Max participants must be between 2 and 100"),

    body("visibilityRadius")
        .optional()
        .isFloat({ min: 1, max: 100 })
        .withMessage("Visibility radius must be between 1 and 100 km"),

];