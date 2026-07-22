import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import { getOnlineUsers } from "../sockets/index.js";

export const getActiveUsers = asyncHandler(

    async (req, res) => {

        const users = Array.from(
            getOnlineUsers().keys()
        );

        return res.status(200).json(

            new ApiResponse(
                200,
                users,
                "Online users fetched successfully"
            )

        );

    }

);