import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import {ClerkProvider} from "@clerk/clerk-react"
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './Reducer/index.js'
import {Provider} from "react-redux"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const store = configureStore({
  reducer: rootReducer,
});

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <Provider store={store}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
    </Provider>
  </StrictMode>,
)
