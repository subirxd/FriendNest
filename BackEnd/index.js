import express from "express";
import cors from "cors";
import "dotenv/config";
import mongodbConnect from "./Config/mongodb.js";
import { inngest, functions } from "./Utils/inngest.js";
import {serve} from "inngest/express"
import { clerkMiddleware} from '@clerk/express'
import { cloudinaryConnect } from "./Config/cloudinary.js";
import fileUpload from "express-fileupload";
import userRouter from "./Routes/userRoute.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
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

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello world");
})

await mongodbConnect();
      cloudinaryConnect();
