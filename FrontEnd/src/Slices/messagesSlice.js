import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
}

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers:{
        setMessages(state, action){
            state.messages = action.payload;
        },
        addMessage(state, action){
            state.messages = [...state.messages, action.payload];
        },
        resetMessages(state){
            state.messages = [];
        }
    }
});

export const {setMessages, addMessage, resetMessages} = messagesSlice.actions;
export default messagesSlice.reducer;