import express from "express";
import cors from "cors";
import "dotenv/config";
import mongodbConnect from "./Config/mongodb.js";
import { inngest, functions } from "./Utils/inngest.js";
import {serve} from "inngest/express"
import { clerkMiddleware} from '@clerk/express'
import { cloudinaryConnect } from "./Config/cloudinary.js";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRouter from "./Routes/userRoute.js";
import postRouter from "./Routes/postRoute.js";
import storyRouter from "./Routes/storyRoute.js";
import messageRouter from "./Routes/messageRoute.js";
import commentRouter from "./Routes/commentRoutes.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://friend-nest.vercel.app",
    "https://friend-nest-lerkogod7-subirxds-projects.vercel.app",
    "https://friend-nest-git-main-subirxds-projects.vercel.app"
  ],
  credentials: true,
}));


app.use("/api/inngest", serve({ client: inngest, functions }));
app.use(clerkMiddleware());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp"
    })
)
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);
app.use("/api/comment", commentRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello world");
})

await mongodbConnect();
      cloudinaryConnect();
