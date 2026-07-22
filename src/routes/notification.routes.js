import express from "express";

import {

    getNotifications,

    markNotificationAsRead,

    markAllNotificationsAsRead,

    getUnreadCount,

} from "../controllers/notification.controller.js";

import { verifyJWT }
from "../middleware/auth.middleware.js";

const router = express.Router();


// =====================================
// Get Notifications
// =====================================

router.get(
    "/",
    verifyJWT,
    getNotifications
);


// =====================================
// Unread Count
// =====================================

router.get(
    "/unread-count",
    verifyJWT,
    getUnreadCount
);


// =====================================
// Mark All As Read
// =====================================

router.patch(
    "/read-all",
    verifyJWT,
    markAllNotificationsAsRead
);


// =====================================
// Mark One As Read
// =====================================

router.patch(
    "/:id/read",
    verifyJWT,
    markNotificationAsRead
);

export default router;