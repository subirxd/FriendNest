import {v2 as cloudinary} from "cloudinary"

export const cloudinaryConnect = () => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
            console.error("Cloudinary ENV variables are missing.");
            return;
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        });

        console.log("Cloudinary Connected");
    } catch (error) {
        console.log("Error while connecting to cloudinary DB:", error);
    }
}