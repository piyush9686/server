import { body } from "express-validator";

export const createLostFoundValidation = [
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["lost", "found"])
    .withMessage("Type must be either 'lost' or 'found'"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "Wallet",
      "Mobile",
      "Laptop",
      "Keys",
      "Bag",
      "Documents",
      "Jewellery",
      "Pets",
      "Vehicle",
      "Electronics",
      "Other",
    ])
    .withMessage("Invalid category"),

  body("reward")
    .optional()
    .isNumeric()
    .withMessage("Reward must be a number")
    .isFloat({ min: 0 })
    .withMessage("Reward cannot be negative"),

  body("contactMethod")
    .optional()
    .isIn(["chat", "phone","both"])
    .withMessage("Invalid contact method"),

  body("phoneNumber")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),

  body("radius")
    .optional()
    .isInt({ min: 1000, max: 60000 })
    .withMessage("Radius must be between 1000m and 60000m"),
];