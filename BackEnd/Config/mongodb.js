import mongoose from "mongoose";

const url = process.env.MONGODB_URL;

const mongodbConnect = async() => {
    mongoose.connect(`${url}/FriendNest`, {})
        .then(() => {
            console.log("DB Connected successfully");
        }).catch((error) => {
            console.log("Db connection failed");
            console.log(error);
            process.exit(1);
        })
}

export default mongodbConnect;