import { body } from "express-validator";

export const createBusinessValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Business name is required")
        .isLength({ max: 100 })
        .withMessage("Name cannot exceed 100 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("category")
        .isIn([
            "cafe",
            "restaurant",
            "grocery",
            "gym",
            "salon",
            "clinic",
            "coaching",
            "repair",
            "other",
        ])
        .withMessage("Invalid category"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required"),

];