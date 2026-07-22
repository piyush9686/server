import Notification from "../models/notification.model.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";



// =====================================
// Get My Notifications
// =====================================

export const getNotifications = asyncHandler(

    async (req, res) => {

        const notifications = await Notification.find({

            recipient: req.user._id,

        })

            .populate(
                "sender",
                "name avatar"
            )

            .sort({
                createdAt: -1,
            })

            .limit(50);

        return res.status(200).json(

            new ApiResponse(

                200,

                notifications,

                "Notifications fetched successfully"

            )

        );

    }

);


// =====================================
// Mark Notification As Read
// =====================================

export const markNotificationAsRead = asyncHandler(

    async (req, res) => {

        const { id } = req.params;

        const notification =
            await Notification.findOne({

                _id: id,

                recipient: req.user._id,

            });

        if (!notification) {

            throw new ApiError(
                404,
                "Notification not found"
            );

        }

        notification.isRead = true;
        notification.readAt = new Date();

        await notification.save();

        return res.status(200).json(

            new ApiResponse(

                200,

                notification,

                "Notification marked as read"

            )

        );

    }

);


// =====================================
// Mark All Notifications As Read
// =====================================

export const markAllNotificationsAsRead =
    asyncHandler(

        async (req, res) => {

            const result =
                await Notification.updateMany(

                    {

                        recipient: req.user._id,

                        isRead: false,

                    },

                    {

                        $set: {

                            isRead: true,

                            readAt: new Date(),

                        },

                    }

                );

            return res.status(200).json(

                new ApiResponse(

                    200,

                    {
                        modifiedCount:
                            result.modifiedCount,
                    },

                    "All notifications marked as read"

                )

            );

        }

    );


// =====================================
// Get Unread Notification Count
// =====================================

export const getUnreadCount = asyncHandler(

    async (req, res) => {

        const count =
            await Notification.countDocuments({

                recipient: req.user._id,

                isRead: false,

            });

        return res.status(200).json(

            new ApiResponse(

                200,

                {
                    unreadCount: count,
                },

                "Unread count fetched successfully"

            )

        );

    }

);