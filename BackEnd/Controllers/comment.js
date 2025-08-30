import User from "../Models/user.js"
import Post from "../Models/post.js"
import Comment from "../Models/comments.js";
//add comment
export const addComment = async(req, res) => {
    const {postId, comment} = req.body;
    try {
        const {userId} = req.auth();

        //validations
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Not Found."
            })
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post Not Found."
            })
        }

        //now create a comment
        const newComment = await Comment.create({
            post: postId,
            userId: userId,
            comment: comment,
        })

        await Post.findByIdAndUpdate(postId, {$push: {comments: newComment._id}});

        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
            data: newComment
        })
    } catch (error) {
        console.log("Error while adding post: ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

export const deleteComment = async(req, res) => {
    try {
        const {commentId, postId} = req.body;
        const {userId} = req.auth();

        //validations
        const user = await User.findById(userId);
        if(!user){
             return res.status(404).json({
                success: false,
                message: "User Not Found."
            })
        };

        const comment = await Comment.findById(commentId);
        if(!comment){
             return res.status(404).json({
                success: false,
                message: "Comment Not Found."
            })
        }

        const post = await Post.findById(postId);
        if(!post){
             return res.status(404).json({
                success: false,
                message: "Post Not Found."
            })
        }
        if(comment.userId !== userId){
            return res.status(403).json({
                success: false,
                message: "You're not authorized to delete this comment."
            })
        }

        //removing commentId from post's comments array
        const updatedPost = await Post.findByIdAndUpdate(postId, {$pull:{comments: commentId}}).populate({
            path:"comments",
            populate:{
                path:"userId"
            }
        });
        //remove comment
        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully.",
            data: updatedPost
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getComments = async(req, res) => {
    try {
        const {postId} = req.query;
        const comments = await Comment.find({post: postId}).populate({
            path:"userId"
        });

        return res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};