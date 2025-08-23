import { apiConnector } from "../apiConnector";
import { messageRoutes, userRoutes } from "../apis";
import {toast} from "react-hot-toast"

export const sendMessages = (formData, token) => {
    return async(dispatch) => {

        try {
            const {data} = await apiConnector("POST", messageRoutes.sendMessage, formData, {
            Authorization: `Bearer ${token}`
            });

            console.log(data)

            if(data?.success){
                return data;
            }
            else{
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }
};

export const fetchMessages = (userId, token) => {
    return async(dispatch) => {
        try {
            const {data} = await apiConnector("POST", messageRoutes.getMessages, {to_user_id: userId}, {
                Authorization: `Bearer ${token}`
            });

            if(data.success){
                return data;
            }
            else {
                throw new Error(data);
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    } 
};

export const getRecentMessages = (token) => {
    return async(dispatch) => {
        try {
            const {data} = await apiConnector("GET", userRoutes.getRecentMessages, null, {
                Authorization: `Bearer ${token}`
            });

            if(data.success){
                return data;
            } else {
                throw new error(data.message);
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}