import { useEffect, useState } from 'react'
import './App.css'
import { Router, Routes, Route, useLocation } from 'react-router-dom'
import Login from './Pages/Login'
import Feed from './Pages/Feed'
import Messages from "./Pages/Messages"
import ChatBox from "./Pages/ChatBox"
import Connections from "./Pages/Connections"
import Discover from "./Pages/Discover"
import Profile from "./Pages/Profile"
import CreatePost from "./Pages/CreatePost"
import Layout from "./Pages/Layout"
import { useAuth, useUser } from '@clerk/clerk-react'
import {Toaster} from "react-hot-toast"
import {useDispatch} from "react-redux"
import { fetchUser } from './Services/Operations/userAPIs'
import { fetchConnections } from './Services/Operations/connectionAPIs'
import { setConnection } from './Slices/connectionSlice'
import { useRef } from 'react'
import { addMessage } from './Slices/messagesSlice'

function App() {
  const pathname = useLocation();
  const pathnameRef = useRef(pathname);
  const dispatch = useDispatch();
  const {user} = useUser();
  const {getToken} = useAuth();
  
  useEffect(() => {
    const fetchData = async() => {
      
        if(user && getToken){
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      }
    }

    fetchData();
  }, [user, getToken, dispatch]);


  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

useEffect(() => {
    if (user) {
        const eventSource = new EventSource(import.meta.env.VITE_BASE_URL + "/api/message/" + user.id);
        eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(event);
            console.log(pathnameRef.current);
            if (pathnameRef.current.pathname === ("/messages/" + message.from_user_id._id)) {
                dispatch(addMessage(message));
            } else {
                
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE Error:", error);
            eventSource.close();
        };

        return () => {
            
            eventSource.close();
        };
    }
    }, [user, dispatch]);
  return (
    <>
    <Toaster />
      <Routes>

        <Route path='/' element={ !user ?  <Login /> : <Layout />}>
        <Route index element={<Feed />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/messages/:userId' element={<ChatBox />} />
        <Route path='/connections' element={<Connections />} />
        <Route path='/discover' element={<Discover />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/:profileId' element={<Profile />} />
        <Route path='/create-post' element={<CreatePost />} />

        </Route>
      </Routes>
    </>
  )
}

export default App
