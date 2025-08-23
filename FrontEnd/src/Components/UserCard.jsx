import React from 'react'
import { MapPin, MessageCircle, MessageSquare, Plus, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { fetchConnections, sendConnectionRequest } from '../Services/Operations/connectionAPIs';
import {handleFollow as handleFollows} from "../Services/Operations/connectionAPIs"
import { setValue } from '../Slices/userSlice';
import {useNavigate} from "react-router-dom"

const UserCard = ({user}) => {
    const currentUser = useSelector((state) => state.user.value);
    const {getToken} = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFollow = async() => {
        try {
            const token = await getToken();
            const response = await dispatch(handleFollows(user._id, token));

            if(response.success){
                dispatch(setValue(response.userData));
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleConnectionRequest = async() => {
       if(currentUser.connections.includes(user._id)){
            return  navigate("/messages/"+user._id);
       } 

       try {
            dispatch(sendConnectionRequest(user._id, await getToken()));
       } catch (error) {
            console.error(error);
       }
    }
  return (
    <div key={user._id} className='p-4 pt-6 flex flex-col justify-between w-72 shadow border 
    border-gray-200 rounded-md' >
        <div>
            <img src={user.profile_picture} alt='userImage'
            className='rounded-full w-16 shadow-md mx-auto' />

            <p className='mt-4 font-semibold'> {user.full_name} </p>
            {user.username && <p className='text-gray-500 font-light'> @{user.username}</p>}
            {user.bio && <p className='text-gray-600 mt-2 text-center text-sm px-4'> {user.bio}</p>}
        </div>

        {/* user info div */}
        <div className='flex items-center justify-center gap-2 mt-4 text-xs text-gray-600'>
            <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'>
                <MapPin className='w-4 h-4' /> {user.location}
            </div>

            <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'>
                <span> {user.followers.length} </span> Followers
            </div>
        </div>

        {/* buttons */}
        <div className='flex mt-4 gap-2'>

        {/* follow button */}
        <button 
        disabled = {currentUser?.following.includes(user._id)}
        className={` w-full py-2 rounded-md flex justify-center items-center gap-2
            ${ currentUser?.following.includes(user._id)
            ? "bg-slate-400 cursor-not-allowed" 
            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 cursor-pointer"}
        transition text-white `}
        onClick={handleFollow}
        >
            <UserPlus className='w-4 h-4' /> {currentUser?.following.includes(user._id)
            ? "Following" : "Follow"
            }
        </button>

        {/* message or connection request button */}

        <button className='flex items-center justify-center w-16 border text-slate-500 group 
        rounded-md cursor-pointer active:scale-95 transition'
        onClick={handleConnectionRequest}
        >
            
            {
                currentUser?.connections.includes(user._id) 
                ? <MessageCircle className='w-5 h-5 group-hover:scale-105 transition' /> 
                : <Plus className='w-5 h-5 group-hover:scale-105 transition' />
            }
        </button>

        
        </div>
    </div>
  )
}

export default UserCard