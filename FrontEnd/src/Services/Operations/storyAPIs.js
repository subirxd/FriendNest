import { apiConnector } from "../apiConnector";
import { storyRoutes } from "../apis";

export const addStory = (formData, token) => {
    return async (dispatch) => {
        try {
            const response = await apiConnector("POST", storyRoutes.createStory, formData, {
                Authorization: `Bearer ${token}`
            });

            if(response?.data?.success){
                return response.data;
            }
            else{
                throw new Error(response.data);
            }
        } catch (error) {
            console.error(error.response.data);
        }
    }
}