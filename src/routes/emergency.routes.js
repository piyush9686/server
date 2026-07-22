import express from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
    createEmergency,
    getNearbyEmergencies,
    resolveEmergency,
    toggleHelpEmergency,
    getEmergencyById,
    respondToEmergency,
} from "../controllers/emergency.controller.js";

import {
    createEmergencyValidation,
    validate,
} from "../validations/emergency.validation.js";

const router = express.Router();

// =====================================
// Create Emergency
// =====================================

router.post(
    "/",
    verifyJWT,
    createEmergencyValidation,
    validate,
    createEmergency
);

// =====================================
// Nearby Emergencies
// =====================================

router.get(
    "/nearby",
    verifyJWT,
    getNearbyEmergencies
);

// =====================================
// Resolve Emergency
// =====================================

router.patch(
    "/:id/resolve",
    verifyJWT,
    resolveEmergency
);

// =====================================
// Help Emergency
// =====================================

router.post(
    "/:id/help",
    verifyJWT,
    toggleHelpEmergency
);

router.get(
    "/:id",
    verifyJWT,
    getEmergencyById
);


router.post(

    "/:id/respond",

    verifyJWT,

    respondToEmergency

);

export default router;