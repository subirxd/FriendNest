import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { postRoutes } from "../apis";

export const addPost = (formData, token) => {
    return async (dispatch) => {
        try {
            const response = await apiConnector("POST", postRoutes.addPost, formData, {
                Authorization: `Bearer ${token}`
            });

            console.log("Add post response:", response);

            if (response?.data?.success) {
                toast.success(response.data.message);
            } else {
                throw new Error(response.data.message);
            }

            return response.data;
            
        } catch (error) {
            console.error("Error in addPost thunk:", error.message);
            throw new Error("Failed to upload post. Please try again.");
        }
    };
};

export const fetchFeedData = (token) => {
    return async(dispatch) => {
        try {
            const response = await apiConnector("GET", postRoutes.getFeed, null, {
                Authorization: `Bearer ${token}`
            });

            if(response?.data?.success){
                return response?.data;
            }
            else{
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
};

export const likePost = (postId, token) => {
    return async (dispatch) => {
        try {
            const response = await apiConnector("POST", postRoutes.likePost, {postId}, {
                Authorization: `Bearer ${token}`
            });

            if(response?.data?.success){
                return response.data;
            }
            else{
                throw new Error(response.data.message || "Something went wrong on the server.");
            }
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }
}