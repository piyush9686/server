import express from "express";

import { verifyJWT }
from "../middleware/auth.middleware.js";

import { validate }
from "../middleware/validation.middleware.js";

import {

    createEvent,
    getNearbyEvents,
    joinEvent,
    leaveEvent,
    getEventById,
    deleteEvent,

} from "../controllers/event.controller.js";

import { createEventValidation }
from "../validations/event.validation.js";

import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
    "/",
    verifyJWT,
    upload.array("eventImage", 1),
    createEventValidation,
    validate,
    createEvent
);

router.get(
    "/nearby",
    verifyJWT,
    getNearbyEvents
);

router.post(
    "/:eventId/join",
    verifyJWT,
    joinEvent
);

router.post(
    "/:eventId/leave",
    verifyJWT,
    leaveEvent
);

router.get(
    "/:eventId",
    verifyJWT,
    getEventById
);

router.delete(
    "/:eventId",
    verifyJWT,
    deleteEvent
);

export default router;