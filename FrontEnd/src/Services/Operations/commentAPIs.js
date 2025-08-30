import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { commentRoutes } from "../apis";

export const addComment = (postId, comment, token) => {
    return async () => {
        try {
            const response = await apiConnector("POST", commentRoutes.addComment, { postId, comment }, {
                Authorization: `Bearer ${token}`
            });

            if (response?.data?.success) {
                toast.success("Comment added successfully");
                return response.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Error in addComment thunk:", error.message);
            toast.error("Failed to add comment. Please try again.");
            throw error;
        }
    };
};

export const deleteComment = (commentId, postId, token) => {
    return async () => {
        try {
            const response = await apiConnector("DELETE", commentRoutes.deleteComment, { commentId, postId }, {
                Authorization: `Bearer ${token}`
            });

            if (response?.data?.success) {
                toast.success("Comment deleted successfully");
                return response.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Error in deleteComment thunk:", error.message);
            toast.error("Failed to delete comment. Please try again.");
            throw error;
        }
    };
};

export const getComments = (postId, token) => {
    return async () => {
        try {
            const response = await apiConnector("GET", `${commentRoutes.getComments}?postId=${postId}`, null, {
                Authorization: `Bearer ${token}`
            });

            if (response?.data?.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Error in getComments thunk:", error.message);
            throw error;
        }
    };
};
