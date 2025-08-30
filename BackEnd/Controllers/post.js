import Post from "../Models/post.js";
import User from "../Models/user.js";
import { uploadImageToCloudinary } from "../Utils/imageUpload.js";

//add post
export const addPost = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {content, post_type} = req?.body;
        const images = req?.files?.images;

        // Input validation
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Post content is required."
            });
        }

        if (content.length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Post content cannot exceed 1000 characters."
            });
        }

        if (!['text', 'image', 'text_with_image'].includes(post_type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post type."
            });
        }

        let image_urls = [];

        if (images && images.length) {
        // use Promise.all to wait for all the uploads to complete
        const uploadPromises = images.map((image, index) => {
            return uploadImageToCloudinary(image, process.env.CLOUDINARY_FOLDER_NAME);
        });
        
        // await the resolution of all promises
        const uploadResults = await Promise.all(uploadPromises);
        
        // map the results to get the secure_url
        image_urls = uploadResults.map(response => response.secure_url);
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type,
        });

        return res.status(200).json({
            success: true,
            message: "Post uploaded successfully."
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

//get post
export const getFeedPost = async(req, res) => {
    try {
        const {userId} = req.auth();

        const user = await User.findById(userId);
        
        //user connections && followings
        const userIds = [userId, ...(user.connections || []), ...(user.following || [])];
        const posts = await Post.find({user: {$in: userIds}}).populate("user").sort({createdAt: -1});

        return res.status(200).json({
            success: true,
            data: posts,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

//like && unlike post
export const likePost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { postId } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post is unavailable."
            });
        }

        // check if the user has already liked the post
        if (post.likes_count.includes(userId)) {
            // if liked, use $pull to atomically remove the userId
            await Post.findByIdAndUpdate(postId, { $pull: { likes_count: userId } });
            
            return res.status(200).json({
                success: true,
                message: "Post unliked successfully."
            });
        } else {
            // if not liked, use $push to atomically add the userId
            await Post.findByIdAndUpdate(postId, { $push: { likes_count: userId } });
            
            return res.status(200).json({
                success: true,
                message: "Post liked successfully."
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};