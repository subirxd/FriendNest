import { setValue } from "../../Slices/userSlice";
import { apiConnector } from "../apiConnector";
import { userRoutes } from "../apis";
import toast from "react-hot-toast"

export const fetchUser = (token) => {
    return async (dispatch) => {
        try {
            const response = await apiConnector("GET", userRoutes.fetchUser, null, {
                Authorization: `Bearer ${token}`
            });

            if (response.data?.success) {
                dispatch(setValue(response?.data?.data));
            } else {
                console.error("API call failed:", response);
                return null;
            }
        } catch (error) {
            console.error("An error occurred:", error.message);
            return null;
        }
    };
};

export const updateUser = (userData, token) => {
    return async(dispatch) => {
       try {
         const response = await apiConnector("POST", userRoutes.updateUser, userData, {
            Authorization: `Bearer ${token}`
            });

            if(response?.data?.success){
                toast.success(response.data.message);
                return response?.data;
            }
            else{
                toast.error(response.message);
                console.error("API call failed:", response|| "Unknown error");
                return null;
            }
       } catch (error) {
            console.error("An error occured:", error.message);
            return null;
       }
    }
};

export const getProfile = (profileId, token) => {
    return async(dispatch) => {
        try {
            //console.log(profileId);
            const response = await apiConnector("POST", userRoutes.getProfile, {profileId}, {
                Authorization: `Bearer ${token}`
            });

            if(response?.data?.success){
                return response?.data
            }
        } catch (error) {
            console.error("An error occured: ", error);
            return null;
        }
    }
};