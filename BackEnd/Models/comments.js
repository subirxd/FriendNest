import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    userId: {
        type: String,
        ref : "User",
        required: true,
    },
    comment:{
        type: String,
        required: true,
    },
},{timestamps: true});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;