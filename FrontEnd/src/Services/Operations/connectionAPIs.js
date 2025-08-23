import toast from "react-hot-toast";
import { setConnection, setFollowers, setFollowing, setPendingConnections } from "../../Slices/connectionSlice";
import { apiConnector } from "../apiConnector";
import { userRoutes } from "../apis";

export const fetchConnections = (token) => {
    return async(dispatch) => {
        try {
            const response = await apiConnector("GET", userRoutes.getConnections, null,
                {
                    Authorization: `Bearer ${token}`
                }
            );
            //console.log(response);
            if(response?.data?.success){
                dispatch(setConnection(response.data.connections));
                dispatch(setFollowers(response.data.followers));
                dispatch(setFollowing(response.data.following));
                dispatch(setPendingConnections(response.data.pendingConnection));
                return response.data.message;

            } else {
                throw new Error(response.data);
            }

        } catch (error) {
            console.error(error);
        }
    }
};

export const handleUnfollow = (userId, token) => {
    return async (dispatch) => {
        try {
            const response = await apiConnector("POST", userRoutes.unfollowUser, {userToUnfollowId: userId}, {
                Authorization: `Bearer ${token}`
            });

            if(response?.data.success){
                toast.success(response.data.message);
                return response.data;                
            } else {
                throw new Error(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    }
};

export const handleFollow = (userId, token) => {
    return async (dispatch) => {
        try {
        const response = await apiConnector("POST", userRoutes.followUser, {userToFollowId: userId}, {
                Authorization: `Bearer ${token}`
            });
            console.log(response);
           if(response?.data.success){
                toast.success("Following this user successfully.");
                return response.data;                
            } else {
                throw new Error(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    }
};


export const acceptConnectionRequest = (userId, token) => {
    return async (dispatch) => {
        try {
            const response = await apiConnector("POST", userRoutes.acceptConnection, {senderId:userId}, {
                Authorization: `Bearer ${token}`
            });

            if(response?.data.success){
                toast.success(response.data.message);
            } else {
                throw new Error(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    }
};

export const rejectConnectionRequest = (userId, token) => {
    return async (dispatch) => {
        try {
            const response = await apiConnector("POST", userRoutes.rejectConnection, {senderId: userId}, {
                Authorization: `Bearer ${token}`
            });

            if(response?.data.success){
                toast.success(response.data.message);
                return response.data;
            } else {
                throw new Error(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    }
};

export const sendConnectionRequest = (userId, token) => {
    return async (dispatch) => {
        const toastId = toast.loading("Sending Connection Request...", {position: "bottom-center"})
        try {
            const {data} = await apiConnector("POST", userRoutes.connectUser, {receiverId: userId}, {
                Authorization: `Bearer ${token}`
            });

            console.log(data);

            if(data.success){
                toast.success(data.message);
                return data; 
            } else {
                throw new Error(data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message, {});
        } finally{
            toast.dismiss(toastId);
        }
    }
}