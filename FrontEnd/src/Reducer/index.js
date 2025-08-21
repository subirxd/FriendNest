import {combineReducers} from "@reduxjs/toolkit"

import userReducer from "../Slices/userSlice.js"
import messagesReducer from "../Slices/messagesSlice.js"
import connectionReducer from "../Slices/connectionSlice.js"

const rootReducer = combineReducers({
    user: userReducer,
    messages: messagesReducer,
    connections: connectionReducer

});

export default rootReducer;