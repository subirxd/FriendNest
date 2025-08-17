import express from "express";
import cors from "cors";
import "dotenv/config";
import mongodbConnect from "./Config/mongodb.js";
import { inngest, functions } from "./Utils/inngest.js";
import {serve} from "inngest/express"

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true,
}));

app.use("/api/inngest", serve({ client: inngest, functions }));

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

await mongodbConnect();