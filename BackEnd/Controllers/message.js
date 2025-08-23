import User from "../Models/user.js";
import Message from "../Models/messages.js";
import { uploadImageToCloudinary } from "../Utils/imageUpload.js";

//an empty object to store SS event connection
const connections = {};

//controller function for SSE endpoint
export const serverSideEventController = (req, res)=>{
    const {userId} = req.params;
    console.log('New Client Connected: ', userId);

    //set server side event headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    //add the client's response object to the connections object
    connections[userId] = res

    //send an initial event to the client
    res.write(`event: log\ndata: Connected to SSE stream\n\n`);

    //handle client disconnection
    req.on('close', () => {
        //remove the client's response object from the connections array
        delete connections[userId];
        console.log("Client disconnected");
    })
};

//send message
export const sendMessage = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {to_user_id, text} = req.body;
        const media = req?.files?.media;
        let media_url = "";
        let message_type = "text";

        if(media){
            const response = await uploadImageToCloudinary(media, process.env.CLOUDINARY_FOLDER_NAME);
            media_url = response.secure_url;
            message_type = response?.resource_type === "image" ? "image" : "video"
        };

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type,
            media_url,
        });

        //send message to_user_id using SSE
        const messageWithUserData = await Message.findById(message._id).populate("from_user_id");

        if(connections[to_user_id]){
            console.log("sending SSE to:", to_user_id, messageWithUserData);
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }

        return res.status(200).json({
            success: true,
            data: message,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//get chat messages
export const getChatMessages = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {to_user_id} = req.body;

        const messages = await Message.find({
            $or:[
                { from_user_id: userId, to_user_id: to_user_id},
                {from_user_id: to_user_id, to_user_id: userId},
            ]
        })

        //mark messages as seen
        await Message.updateMany({from_user_id: to_user_id, to_user_id: userId}, 
            {$set:{seen: true}});

        return res.status(200).json({
            success: true,
            data: messages
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//get user recent message
export const getUserRecentMessages = async(req, res) => {
    try {
        const {userId} = req.auth();
        
        const messages = await Message.find({
            to_user_id: userId
        }).populate(["from_user_id", "to_user_id"]).sort({createdAt: -1});

        return res.status(200).json({
            success: true,
            data: messages
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};