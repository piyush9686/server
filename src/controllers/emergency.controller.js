import Emergency from "../models/emergency.model.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

import getEmergencyPriority from "../utils/getEmergencyPriority.js";
import { getIO } from "../sockets/index.js";

// =====================================
// Create Emergency
// =====================================

// export const createEmergency = asyncHandler(async (req, res) => {

//     const {
//         type,
//         title,
//         description,
//         visibilityRadius,
//     } = req.body;

//     const priority = getEmergencyPriority(type);

//     // User must have location
//     if (
//         !req.user.location ||
//         req.user.location.coordinates[0] === 0
//     ) 
//        { throw new ApiError(
//             400,
//             "Please update your location first"
//         );
//     }

//     const emergency = await Emergency.create({

//         user: req.user._id,
//         type,

//         title,

//         description,
//         priority,

//         visibilityRadius: visibilityRadius || 10,

//         location: req.user.location,

//     });

//     const createdEmergency = await Emergency
//         .findById(emergency._id)
//         .populate(
//             "user",
//             "name avatar trustLevel"
//         );
//          getIO().emit(
//     "newEmergency",
//     createdEmergency
// );
//     return res.status(201).json(
//         new ApiResponse(
//             201,
//             createdEmergency,
//             "Emergency created successfully"
//         )
//     );

// });


export const createEmergency = asyncHandler(
    async (req, res) => {

        const {
            type,
            title,
            description,
            visibilityRadius,

            reportForSomeoneElse,
            contactName,
            contactPhone,

            location,
        } = req.body;


        // =====================================
        // Validate Location
        // =====================================

        if (

            !location ||

            location.type !== "Point" ||

            !Array.isArray(
                location.coordinates
            ) ||

            location.coordinates.length !== 2

        ) {

            throw new ApiError(

                400,

                "Please select a valid incident location"

            );

        }


        const [
            longitude,
            latitude,
        ] = location.coordinates;


        if (

            typeof longitude !== "number" ||

            typeof latitude !== "number"

        ) {

            throw new ApiError(

                400,

                "Invalid location coordinates"

            );

        }


        // =====================================
        // Validate Reported Person
        // =====================================

        if (

            reportForSomeoneElse &&

            (

                !contactName?.trim() ||

                !contactPhone?.trim()

            )

        ) {

            throw new ApiError(

                400,

                "Name and phone are required when reporting for someone else"

            );

        }


        // =====================================
        // Calculate Priority
        // =====================================

        const priority =

            getEmergencyPriority(type);


        // =====================================
        // Create Emergency
        // =====================================

        const emergency = await Emergency.create({

            user: req.user._id,

            type,

            title,

            description,

            priority,

            visibilityRadius:

                visibilityRadius || 10,


            // Map-selected location

            location: {

                type: "Point",

                coordinates: [

                    longitude,

                    latitude,

                ],

            },


            reportForSomeoneElse:

                Boolean(

                    reportForSomeoneElse

                ),


            contactName:

                reportForSomeoneElse

                    ? contactName.trim()

                    : "",


            contactPhone:

                reportForSomeoneElse

                    ? contactPhone.trim()

                    : "",

        });


        // =====================================
        // Populate Creator
        // =====================================

        const createdEmergency =

            await Emergency

                .findById(

                    emergency._id

                )

                .populate(

                    "user",

                    "name avatar trustLevel phone"

                );


        // =====================================
        // Real-time Notification
        // =====================================

        getIO().emit(

            "newEmergency",

            createdEmergency

        );


        return res.status(201).json(

            new ApiResponse(

                201,

                createdEmergency,

                "Emergency created successfully"

            )

        );

    }

);


// =====================================
// Get Nearby Emergencies
// =====================================

// export const getNearbyEmergencies = asyncHandler(

//     async (req, res) => {

//         const radius = Math.min(
//             Number(req.query.radius) || req.user.radius || 50,
//             60
//         );

//         const maxDistance = radius * 1000;

//         const emergencies = await Emergency.find({

//             status: "active",

//             isDeleted: false,

//             location: {
//                 $near: {
//                     $geometry: req.user.location,
//                     $maxDistance: maxDistance,
//                 },
//             },

//         })
//         .populate(
//             "user",
//             "name avatar trustLevel"
//         )
//         .sort({ createdAt: -1 });

//         return res.status(200).json(

//             new ApiResponse(
//                 200,
//                 emergencies,
//                 `Nearby emergencies within ${radius} km fetched successfully`
//             )

//         );

//     }

// );


// =====================================
// Resolve Emergency
// =====================================

export const resolveEmergency = asyncHandler(

    async (req, res) => {

        const { id } = req.params;

        const emergency = await Emergency.findById(id);

        if (!emergency || emergency.isDeleted) {
            throw new ApiError(404, "Emergency not found");
        }

        // Ownership check
        if (
            emergency.user.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "You can only resolve your own emergencies"
            );
        }

        emergency.status = "resolved";
        emergency.resolvedAt = new Date();

        await emergency.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                emergency,
                "Emergency resolved successfully"
            )
        );

    }

);

// =====================================
// Get Nearby Emergencies
// =====================================

export const getNearbyEmergencies = asyncHandler(

    async (req, res) => {

        const radius = Math.min(
            Number(req.query.radius) || req.user.radius || 50,
            60
        );

        const maxDistance = radius * 1000;

        const emergencies = await Emergency.aggregate([

            {
                $geoNear: {

                    near: req.user.location,

                    distanceField: "distanceInMeters",

                    maxDistance,

                    spherical: true,

                },
            },

            {
                $match: {
                    status: "active",
                    isDeleted: false,
                },
            },

            {
                $sort: {
                    createdAt: -1,
                },
            },

        ]);

        // const formattedEmergencies = emergencies.map(
        //     (emergency) => ({

        //         ...emergency,

        //         distance: `${(
        //             emergency.distanceInMeters / 1000
        //         ).toFixed(1)} km`,

        //     })
        // );

      
        const formattedEmergencies = emergencies.map(
    (emergency) => ({

        ...emergency,

        // Numeric distance (for calculations)
        distance:
            emergency.distanceInMeters / 1000,

    })
);

      











        return res.status(200).json(

            new ApiResponse(
                200,
                formattedEmergencies,
                `Nearby emergencies within ${radius} km fetched successfully`
            )

        );

    }

);


// =====================================
// Help / Unhelp Emergency
// =====================================

export const toggleHelpEmergency = asyncHandler(

    async (req, res) => {

        const { id } = req.params;

        const emergency = await Emergency.findById(id);

        if (!emergency || emergency.isDeleted) {
            throw new ApiError(404, "Emergency not found");
        }

        if (emergency.status !== "active") {
            throw new ApiError(
                400,
                "This emergency has already been resolved"
            );
        }

        const userId = req.user._id.toString();

        // User cannot help themselves
        if (emergency.user.toString() === userId) {
            throw new ApiError(
                400,
                "You cannot help your own emergency"
            );
        }

        const alreadyHelping = emergency.helpers.some(
            helper => helper.toString() === userId
        );

        let message = "";

        if (alreadyHelping) {

            emergency.helpers = emergency.helpers.filter(
                helper => helper.toString() !== userId
            );

            message = "You stopped helping";

        } else {

            emergency.helpers.push(req.user._id);

            message = "You are now helping this emergency";

        }

        await emergency.save();

        return res.status(200).json(

            new ApiResponse(
                200,
                {
                    helping: !alreadyHelping,
                    totalHelpers: emergency.helpers.length,
                },
                message
            )

        );

    }

);


export const getEmergencyById = asyncHandler(

    async (req, res) => {

        const { id } = req.params;

        const emergency = await Emergency.findById(id)
            .populate("user", "name avatar phone");

        if (!emergency) {

            throw new ApiError(
                404,
                "Emergency not found"
            );

        }

        return res.status(200).json(

            new ApiResponse(

                200,

                emergency,

                "Emergency fetched successfully"

            )

        );

    }

);

export const respondToEmergency = asyncHandler(

    async (req, res) => {

        const { id } = req.params;

        const { type, message } = req.body;

        const emergency = await Emergency.findById(id);

        if (!emergency) {

            throw new ApiError(

                404,

                "Emergency not found"

            );

        }

        // Check if this user has already responded

        const existingResponse = emergency.responses.find(

            (response) =>

                response.user.toString() ===

                req.user._id.toString()

        );

        if (existingResponse) {

            existingResponse.type = type;

            existingResponse.message = message || "";

            existingResponse.createdAt = new Date();

        }

        else {

            emergency.responses.push({

                user: req.user._id,

                type,

                message,

            });

        }

        await emergency.save();

        await emergency.populate({

            path: "responses.user",

            select: "name avatar",

        });

        return res.status(200).json(

            new ApiResponse(

                200,

                emergency,

                "Response submitted successfully"

            )

        );

    }

);