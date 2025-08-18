import cloudinary from "cloudinary"

export const uploadImageToCloudinary = async(file, folder, height, quality) => {
    try {
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