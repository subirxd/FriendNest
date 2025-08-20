import Story from "../Models/story.js";
import User from "../Models/user.js";
import { uploadImageToCloudinary } from "../Utils/imageUpload.js";

//add user story
export const addUserStory = async(req, res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Not Found."
            })
        }

        const {content, media_type, background_color} = req.body;
        const media = req?.files?.media;

        let media_url = "";

        //upload media if available
        if(media){
            const response = await uploadImageToCloudinary(media, process.env.CLOUDINARY_FOLDER_NAME);
            media_url = response.secure_url;
        }

        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            background_color
        });

        return res.status(200).json({
            success: true,
            message: "Story Added."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })   
    }
};

//get user stories
export const getStories = async(req, res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId);

        //user connections & followings
        const userIds = [userId, ...user.connections, ...user.following];

        const stories = await Story.find({
            user: {$in: userIds}
        }).populate("user").sort({createdAt: -1});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        return res.status(200).json({
            success: true,
            message: "Stories fetched succesfully.",
            data: stories
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
};