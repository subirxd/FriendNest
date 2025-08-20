import { Inngest } from "inngest";
import User from "../Models/user.js";
import Connection from "../Models/connection.js";
import sendEmail from "./mailSender.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "FriendNest" });

//ingest function to save the user data into database

const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event}) =>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data;
        let username = email_addresses[0].email_address.split('@')[0];

        //check username is unique
        const user = await User.findOne({username});

        if(user){
            username = username + Math.floor(Math.random() * 10000);
        }

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            full_name: first_name + " "+ last_name,
            profile_picture: image_url,
            username
        };

        await User.create(userData);
    } 
);

//inngest function to update user database
const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: "clerk/user.updated"},
    async({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data;

        const updateUserData = {
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
        }

        await User.findByIdAndUpdate(id, updateUserData);
    }
);

//inngest function to delete user from database

const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event: "clerk/user.delete"},
    async({event}) => {
        const {id} = event.data;

        await User.findByIdAndDelete(id);
    }
);

//Inngest Function to send Reminder when a new connection request is added
const sendNewConnectionRequestReminder = inngest.createFunction(
    {id: "send-new-connection-request-reminder"},
    {event: "app/connection-request"},
    async({event, step}) => {
        const {connectionId} = event.data;

        await step.run("send-connection-request-mail", async () => {
            const connection = await Connection.findById(connectionId).populate(["from_user_id", "to_user_id"]);
            const subject = `New Connection Request`;
            const body = `<div style="background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="text-align: center; padding: 20px 0; background-color: #6366f1; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0;">FriendNest</h1>
    </div>

    <!-- Message Body -->
    <div style="padding: 30px;">
      <h2 style="color: #333333; font-size: 22px; margin-bottom: 20px;">Connection Request</h2>
      
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">Hi ${connection.to_user_id.full_name},</p>
      
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">${connection.from_user_id.full_name} would like to connect with you on FriendNest.</p>
      <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-top: 40px;">Best regards,<br>The FriendNest Team</p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border-top: 1px solid #e0e0e0;">
      <p style="color: #999999; font-size: 12px; margin: 0;">&copy; 2025 FriendNest. All rights reserved.</p>
    </div>
    </div>`;

    await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
    })
        })

        const in24hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await step.sleepUntil("wait-for-25-hours", in24hours);
        await step.run('send-connection-request-reminder', async() => {
            const connection = await Connection.findById(connectionId).populate(["from_user_id", "to_user_id"]);

            if(connection.status === "accepted"){
                return {message: "Already Accepted"}
            }

            const subject = `New Connection Request`;
            const body = `<div style="background-color: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="text-align: center; padding: 20px 0; background-color: #6366f1; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0;">FriendNest</h1>
    </div>

    <!-- Message Body -->
    <div style="padding: 30px;">
      <h2 style="color: #333333; font-size: 22px; margin-bottom: 20px;">Connection Request</h2>
      
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">Hi ${connection.to_user_id.full_name},</p>
      
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">${connection.from_user_id.full_name} would like to connect with you on FriendNest.</p>
      <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-top: 40px;">Best regards,<br>The FriendNest Team</p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border-top: 1px solid #e0e0e0;">
      <p style="color: #999999; font-size: 12px; margin: 0;">&copy; 2025 FriendNest. All rights reserved.</p>
    </div>
    </div>`;

    await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
    })

    return {
        message: "Reminder Sent."
    }

        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation, 
    syncUserUpdation, 
    syncUserDeletion, 
    sendNewConnectionRequestReminder];