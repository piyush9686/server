import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer) => {

    //
    console.log("Bufferexists:", !!buffer);
     console.log("Buffer length:",buffer?.length);

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "localconnect/avatars",
            },
            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            }
        );

        streamifier.createReadStream(buffer).pipe(stream);

    });

};

export default uploadToCloudinary;