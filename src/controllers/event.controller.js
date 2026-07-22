import Event from "../models/event.model.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

import { createNotification } from "../utils/notification.helper.js";

// =====================================
// Create Event
// =====================================





// =====================================
// Create Event
// =====================================

export const createEvent = asyncHandler(

    async (req, res) => {

        console.log("🔥 CREATE EVENT HIT");
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        const {

            title,
            description,
            category,
            eventDate,
            maxParticipants,
            visibilityRadius,

        } = req.body;

        if (
            !req.user.location ||
            !req.user.location.coordinates ||
            req.user.location.coordinates.length !== 2
        ) {

            throw new ApiError(
                400,
                "Please update your location first"
            );

        }

        // ==========================
        // Event Image Upload
        // ==========================

        let eventImage = "";

        if (req.files?.length > 0) {

            const file = req.files[0];

            // Temporary solution
            // Later replace with Cloudinary

            eventImage = `data:${file.mimetype};base64,${file.buffer.toString(
                "base64"
            )}`;

        }

        const event = await Event.create({

            title,

            description,

            eventImage,

            category,

            organizer: req.user._id,

            participants: [req.user._id],

            eventDate,

            maxParticipants:
                Number(maxParticipants) || 10,

            visibilityRadius:
                Number(visibilityRadius) || 10,

            location: req.user.location,

        });

        const createdEvent =
            await Event.findById(event._id)

                .populate(
                    "organizer",
                    "name avatar locationName"
                )

                .populate(
                    "participants",
                    "name avatar"
                );

        return res.status(201).json(

            new ApiResponse(
                201,
                createdEvent,
                "Event created successfully 🎉"
            )

        );

    }

);


// =====================================
// Get Nearby Events
// =====================================

export const getNearbyEvents = asyncHandler(

    async (req, res) => {

        const radius = req.user.radius || 50;

        const [longitude, latitude] =
            req.user.location.coordinates;

        const events = await Event.find({

            status: "upcoming",

            eventDate: {
                $gte: new Date(),
            },

            location: {

                $near: {

                    $geometry: {
                        type: "Point",
                        coordinates: [
                            longitude,
                            latitude,
                        ],
                    },

                    $maxDistance: radius * 1000,

                },

            },

        })

            .populate(
                "organizer",
                "name avatar locationName"
            )

            .populate(
                "participants",
                "name avatar"
            )

            .sort({
                eventDate: 1,
            });

        return res.status(200).json(

            new ApiResponse(
                200,
                events,
                "Nearby events fetched successfully"
            )

        );

    }

);


// =====================================
// Join Event
// =====================================

export const joinEvent = asyncHandler(

    async (req, res) => {

        const { eventId } = req.params;

        const event = await Event.findById(eventId);

        if (!event) {
            throw new ApiError(
                404,
                "Event not found"
            );
        }

        // Already joined
        if (
            event.participants.some(
                participant =>
                    participant.toString() ===
                    req.user._id.toString()
            )
        ) {
            throw new ApiError(
                400,
                "Already joined this event"
            );
        }

        // Event full
        if (
            event.participants.length >=
            event.maxParticipants
        ) {
            throw new ApiError(
                400,
                "Event is full"
            );
        }

        // Add participant
        event.participants.push(
            req.user._id
        );

        await event.save();

        // Send notification to organizer
        await createNotification({

            recipient: event.organizer,

            sender: req.user._id,

            type: "event",

            title: "New Event Participant 🏸",

            message: `${req.user.name} joined your event`,

            referenceId: event._id,

        });

        return res.status(200).json(

            new ApiResponse(
                200,
                event,
                "Joined event successfully"
            )

        );

    }

);


// =====================================
// Leave Event
// =====================================

export const leaveEvent = asyncHandler(

    async (req, res) => {

        const { eventId } = req.params;

        const event =
            await Event.findById(eventId);

        if (!event) {
            throw new ApiError(
                404,
                "Event not found"
            );
        }

        // Organizer cannot leave
        if (
            event.organizer.toString() ===
            req.user._id.toString()
        ) {
            throw new ApiError(
                400,
                "Organizer cannot leave the event"
            );
        }

        event.participants =
            event.participants.filter(

                participant =>

                    participant.toString() !==
                    req.user._id.toString()

            );

        await event.save();

        return res.status(200).json(

            new ApiResponse(
                200,
                event,
                "Left event successfully"
            )

        );

    }

);


// =====================================
// Get Event By ID
// =====================================

export const getEventById = asyncHandler(

    async (req, res) => {

        const { eventId } = req.params;

        const event = await Event.findById(eventId)

            .populate(
                "organizer",
                "name avatar"
            )

            .populate(
                "participants",
                "name avatar"
            );

        if (!event) {
            throw new ApiError(
                404,
                "Event not found"
            );
        }

        return res.status(200).json(

            new ApiResponse(
                200,
                event,
                "Event fetched successfully"
            )

        );

    }

);


// =====================================
// Delete Event
// =====================================

export const deleteEvent = asyncHandler(

    async (req, res) => {

        const { eventId } = req.params;

        const event = await Event.findById(eventId);

        if (!event) {
            throw new ApiError(
                404,
                "Event not found"
            );
        }

        if (
            event.organizer.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "Only the organizer can delete this event"
            );
        }

        await event.deleteOne();

        return res.status(200).json(

            new ApiResponse(
                200,
                null,
                "Event deleted successfully"
            )

        );

    }

);


