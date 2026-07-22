import express from "express";

import upload from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

// =====================================
// Upload Image
// =====================================

router.post(
    "/image",
    verifyJWT,
    upload.single("image"),
    uploadImage
);

export default router;