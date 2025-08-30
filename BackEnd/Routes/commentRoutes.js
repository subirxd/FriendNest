import express from "express";
import { addComment, deleteComment, getComments } from "../Controllers/comment.js";
import { protect } from "../Middlewares/auth.js";

const commentRouter = express.Router();

commentRouter.post("/add", protect, addComment);
commentRouter.delete("/delete", protect, deleteComment);
commentRouter.get("/get", protect, getComments);

export default commentRouter;