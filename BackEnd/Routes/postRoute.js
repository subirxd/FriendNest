import express from "express"
import { protect } from "../Middlewares/auth.js";
import { addPost, getFeedPost, likePost } from "../Controllers/post.js";
const postRouter = express.Router();

postRouter.post("/add", protect, addPost);
postRouter.get("/feed", protect, getFeedPost);
postRouter.post("/like", protect, likePost);

export default postRouter;
