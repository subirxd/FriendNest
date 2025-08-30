import cloudinary from "cloudinary"

export const uploadImageToCloudinary = async(file, folder, height, quality) => {
    try {
        // File validation
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
        }

        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 5MB.');
        }

        let options = {folder};
        if(height) options.height = height;
        if(quality) options.quality = quality;

        options.resource_type = "auto";

        return await cloudinary.v2.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        console.log("Error while uploading file to cloudinary:", error);
        throw error;
    }
}