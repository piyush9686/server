import Notification from "../models/notification.model.js";
import { getIO } from "../sockets/index.js";

// =====================================
// Create Notification
// =====================================

export const createNotification = async ({

    recipient,
    sender,
    type,
    title,
    message,
    referenceId = null,

}) => {

    // Prevent self-notifications
    if (recipient.toString() === sender.toString()) {
        return null;
    }

    // Save to database
    const notification = await Notification.create({

        recipient,
        sender,
        type,
        title,
        message,
        referenceId,

    });

    // Populate sender details
    const populatedNotification =
        await Notification.findById(
            notification._id
        ).populate(
            "sender",
            "name avatar"
        );

    // Real-time notification
    getIO().to(recipient.toString()).emit(

        "newNotification",

        populatedNotification

    );

    return populatedNotification;

};