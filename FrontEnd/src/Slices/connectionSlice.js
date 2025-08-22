import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    connection: [],
    pendingConnections: [],
    followers: [],
    following: []
}

const connectionSlice = createSlice({
    name: "connections",
    initialState,
    reducers:{
        setConnection(state, action) {
            state.connection = action.payload;
        },

        setPendingConnections(state, action){
            state.pendingConnections = action.payload;
        },

        setFollowers(state, action){
            state.followers = action.payload;
        },

        setFollowing(state, action){
            state.following = action.payload;
        },
        
    }
})

export const {
    setConnection, 
    setPendingConnections,
    setFollowers,
    setFollowing
} = connectionSlice.actions;
export default connectionSlice.reducer;