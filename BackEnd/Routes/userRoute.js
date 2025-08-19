import express from "express";
import { acceptConnectionRequest, discoverUser, followUser, getUserConnections, getUserData, rejectConnectionRequest, sendConnectionRequest, unfollowUser, updateUserData } from "../Controllers/User.js";
import { protect } from "../Middlewares/auth.js";
const userRouter = express.Router();

userRouter.get("/data", protect ,getUserData);
userRouter.post("/update", protect, updateUserData);
userRouter.post("/discover", protect, discoverUser);
userRouter.post("/follow", protect, followUser);
userRouter.post("/unfollow", protect, unfollowUser);
userRouter.post("/connect", protect, sendConnectionRequest);
userRouter.post("/accept", protect, acceptConnectionRequest);
userRouter.get("/connections", protect, getUserConnections);
userRouter.post("/reject", protect, rejectConnectionRequest);

export default userRouter;