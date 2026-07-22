import express from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";

import { getActiveUsers }
from "../controllers/online.controller.js";

const router = express.Router();

router.get(
    "/active",
    verifyJWT,
    getActiveUsers
);

export default router;