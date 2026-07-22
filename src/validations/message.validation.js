import { body } from "express-validator";

export const sendMessageValidation = [

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Message content is required")
        .isLength({ max: 2000 })
        .withMessage("Message cannot exceed 2000 characters"),

];