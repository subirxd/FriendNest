import express from "express";
import { discoverUser, followUser, getUserData, unfollowUser, updateUserData } from "../Controllers/User.js";
import { protect } from "../Middlewares/auth.js";
const userRouter = express.Router();

userRouter.get("/data", protect ,getUserData);
userRouter.post("/update", protect, updateUserData);
userRouter.post("/discover", protect, discoverUser);
userRouter.post("/follow", protect, followUser);
userRouter.post("/unfollow", protect, unfollowUser);

export default userRouter;