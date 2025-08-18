import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
    from_user_id: {
        type: String,
        ref:"User",
        required: true,
    },

    to_user_id: {
        type:"String",
        ref:"User",
        required: true,
    },
    status:{
        type:"String",
        enum:["Pending", "Accepted"],
        default:"Pending",
    }
}, {timeseries: true});

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;