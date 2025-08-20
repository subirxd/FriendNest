import express from "express"
import { protect } from "../Middlewares/auth.js";
import { addUserStory, getStories } from "../Controllers/story.js";
const storyRouter = express.Router();

storyRouter.post("/create", protect, addUserStory);
storyRouter.get("/getStory", protect, getStories);

export default storyRouter;