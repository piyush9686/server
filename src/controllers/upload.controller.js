import streamifier from "streamifier";

import cloudinary from "../config/cloudinary.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// =====================================
// Upload Image
// =====================================

export const uploadImage = asyncHandler(

    async (req, res) => {

        if (!req.file) {

            throw new ApiError(
                400,
                "No image uploaded"
            );

        }

        const uploadFromBuffer = () => {

            return new Promise((resolve, reject) => {

                const stream =
                    cloudinary.uploader.upload_stream(

                        {

                            folder: "LocalConnect",

                        },

                        (error, result) => {

                            if (error) {

                                reject(error);

                            } else {

                                resolve(result);

                            }

                        }

                    );

                streamifier.createReadStream(
                    req.file.buffer
                ).pipe(stream);

            });

        };

        const result =
            await uploadFromBuffer();

        return res.status(200).json(

            new ApiResponse(

                200,

                {

                    imageUrl:
                        result.secure_url,

                },

                "Image uploaded successfully"

            )

        );

    }

);