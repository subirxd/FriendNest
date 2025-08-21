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

    }
})

export default connectionSlice.reducer;