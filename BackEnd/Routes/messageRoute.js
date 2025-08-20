import express from 'express'
import { getChatMessages, sendMessage, serverSideEventController } from '../Controllers/message.js';
import { protect } from '../Middlewares/auth.js';

const messageRouter = express.Router();

messageRouter.get("/:userId", serverSideEventController);
messageRouter.post("/send", protect, sendMessage);
messageRouter.post("/get", protect, getChatMessages);

export default messageRouter;