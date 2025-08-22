import { err } from "inngest/types";
import User from "../Models/user.js";
import Connection from "../Models/connection.js";
import { uploadImageToCloudinary } from "../Utils/imageUpload.js";
import Post from "../Models/post.js";
import { inngest } from "../Utils/inngest.js";

//get userData using userID
export const getUserData = async(req, res) => {
    try {
        const {userId} = req.auth();

        const userDetails = await User.findById(userId);

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: userDetails,
        });

    } catch (error) {
        console.log(error);
        return req.status(500).json({
            success: false,
            message: error.message
        })
    }
};

//update the userData
export const updateUserData = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {username, bio, location, full_name} = req.body;
        const profile = req.files && req.files.profile;
        const cover = req.files && req.files.cover;

        const tempUser = await User.findById(userId);

        if(!tempUser){
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        !username && (username = tempUser.username);

        if(tempUser.username !== username){
            const user = await User.findOne({username});
            if(user){
                return res.status(409).json({
                    success: false,
                    message: "Username is already taken."
                })
            }
        }

         const updatedData = {
            username,
            bio: bio || tempUser.bio,
            location: location || tempUser.location,
            full_name: full_name || tempUser.full_name,
        };

        if(profile){
            const result = await uploadImageToCloudinary(profile, process.env.CLOUDINARY_FOLDER_NAME);
            updatedData.profile_picture = result.secure_url; 
        }

        if(cover){
            const result = await uploadImageToCloudinary(cover, process.env.CLOUDINARY_FOLDER_NAME);
            updatedData.cover_photo = result.secure_url;
        }

        const updated = await User.findByIdAndUpdate(userId, updatedData, {new: true});

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updated,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//find user using username, email, location, name
export const discoverUser = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {input} = req.body;

        const allUsers = await User.find({
            $or:[
                { username: new RegExp(input, 'i')},
                { email: new RegExp(input, 'i')},
                { full_name: new RegExp(input, 'i')},
                { location: new RegExp(input, 'i')},
            ]
        });

        const filteredUsers = allUsers.filter((user) => user._id !== userId);

        if(filteredUsers.length === 0){
            return res.status(404).json({
                success: false,
                message: "No user found."
            });
        }

        return res.status(200).json({
            success: true,
            data: filteredUsers,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//follow user
export const followUser = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {userToFollowId} = req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found, User ID is wrong."
            })
        }

        const userToFollow = await User.findById(userToFollowId);

        if(!userToFollow){
            return res.status(404).json({
                success: false,
                message: "User not found. Target user ID is wrong."
            })
        }

        if(user.following.includes(userToFollowId)){
            return res.status(405).json({
                success: false,
                message:"You're already following this user."
            })
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {$push: {following: userToFollowId}},
            {new: true});

        const updatedUserToFollow = await User.findByIdAndUpdate(
            userToFollowId, 
            {$push: {followers: userId}},
            {new: true});

        return res.status(200).json({
            success: true,
            userData: updatedUser,
            updatedFollower: updatedUserToFollow
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//unfollow the user
export const unfollowUser = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {userToUnfollowId} = req.body;
        
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found. User Id is wrong."
            })
        }

        const userToUnfollow = await User.findById(userToUnfollowId);

        if(!userToUnfollow){
            return res.status(404).json({
                success: false,
                message:"User not found, target UserID is wrong."
            })
        }

        if(!user.following.includes(userToUnfollowId)){
            return res.status(405).json({
                success: false,
                message:"You're not following this user."
            })
        }

        const updatedUserData = await User.findByIdAndUpdate(
            userId, 
            {$pull: {following: userToUnfollowId}}, 
            {new: true});

        const updatedUserToUnfollow = await User.findByIdAndUpdate(
            userToUnfollowId, 
            {$pull: {followers: userId}}, 
            {new: true});

        return res.status(200).json({
            success: true,
            message: "You're no-longer following this user.",
            updatedUserData: updatedUserData,
            updatedUserToUnfollow: updatedUserToUnfollow
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//send connection request
export const sendConnectionRequest = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {receiverId} = req.body;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        const receiver = await User.findById(receiverId);
        if(!receiver){
            return res.status(404).json({
                success: false,
                message: "User not found, ReceiverID is invalid."
            })
        }

        // Check if users are already connected
        if(user.connections.includes(receiverId)){
            return res.status(401).json({
                success: false,
                message: "You're already connected with this user."
            })
        }

        // Check if user has sent too many requests in the last 24 hours
        const last24Hrs = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const connectionRequests = await Connection.find({from_user_id: userId, createdAt: {$gt: last24Hrs}});

        if(connectionRequests.length >= 20){
            return res.status(403).json({
                success: false,
                message: "Too many requests sent in the last 24 hours."
            })
        }

        // Check for any pending requests between the two users
        const pendingConnection = await Connection.findOne({
            $or:[
                {from_user_id: userId, to_user_id: receiverId},
                {from_user_id: receiverId, to_user_id: userId},
            ]
        });
        
        // Handle different pending request scenarios
        if(pendingConnection){
            if(pendingConnection.from_user_id.toString() === userId.toString()){
                return res.status(401).json({
                    success: false,
                    message: "You have already sent a pending connection request to this user."
                });
            } else {
                 return res.status(401).json({
                    success: false,
                    message: "This user has already sent you a connection request."
                });
            }
        }
        
        // If no pending request exists, create a new one
        const connection  = await Connection.create({
            from_user_id: userId,
            to_user_id: receiverId,
        });

        await inngest.send({
            name: 'app/connection.request',
            data: {connectionId: connection._id}
        })
        
        return res.status(200).json({
            success: true,
            message: "Connection request sent successfully."
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//get user connections
export const getUserConnections = async(req, res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId).populate(['connections', 'followers', 'following']);;

        const connections = user?.connections;
        const followers = user?.followers;
        const following = user?.following;

        const pendingConnection = (await Connection.find({to_user_id: userId, status: "pending"})
        .populate("from_user_id")).map((connection) => connection.from_user_id)

        return res.json({
            success: true,
            connections, followers, following, pendingConnection
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//accept the connection request
export const acceptConnectionRequest = async(req, res) => {
    try {
        const {userId} = req.auth();
        const {senderId} = req.body;

        //check if both profile exist
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "Invalid user."
            })
        }

        const sender = await User.findById(senderId);
        if(!sender){
            return res.status(404).json({
                success: false,
                message: "Target user not found."
            })
        }

        const connectionRequest = await Connection.findOne({
            from_user_id: senderId,
            to_user_id: userId,
            status: "pending"
        });

        if(!connectionRequest){
            return res.status(404).json({
                success: false,
                message:"No pending connection request from this user."
            })
        }

        if(user.connections.includes(senderId)){
            return res.status(403).json({
                success: false,
                message: "User is already added."
            })
        }

        const [updatedUser, updatedSender] = await Promise.all([
            User.findByIdAndUpdate(userId, {$push: {connections: senderId}}, {new: true}),
            User.findByIdAndUpdate(senderId, {$push: {connections: userId}}, {new: true}),
        ]);

        connectionRequest.status = "accepted";
        connectionRequest.acceptedAt = Date.now();
        await connectionRequest.save();

        return res.status(200).json({
            success: true,
            message: "User added successfully."
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

//reject connection request
export const rejectConnectionRequest = async(req, res)=>{
    try {
        const {userId} = req.auth();
        const {senderId} = req.body;

        const user = await User.findById(userId);
        const sender = await User.findById(senderId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        if(!sender){
            return res.status(404).json({
                success: false,
                message: "Target user not found."
            })
        }

        const connectionRequest = await Connection.findOne({
            from_user_id: senderId,
            to_user_id: userId,
            status: "pending"
        })

        if(!connectionRequest){
            return res.status(404).json({
                success: false,
                message: "No connection request from this user."
            })
        }

        connectionRequest.status = "rejected";
        await connectionRequest.save();
        
        return res.status(200).json({
            success: true,
            message: "Request rejected successfully."
        })
            
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//get user profiles
export const getUserProfile = async(req, res) => {
     try {
        const {profileId} = req.body;
        const profile = await User.findById(profileId);

        if(!profile){
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }
        
        const posts = await Post.find({user: profileId}).populate("user").sort({createdAt: -1});

        return res.status(200).json({
            success: true,
            profile: profile,
            posts: posts,
        })
     } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
     }
};