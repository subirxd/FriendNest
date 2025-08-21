import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        setValue(state, value){
            state.value = value.payload;
        },
    }
});

export const {setValue} = userSlice.actions;
export default userSlice.reducer;