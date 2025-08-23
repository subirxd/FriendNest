import React, { useEffect, useState } from 'react'
import { Users, UserPlus, UserCheck, UserRoundPen, MessageSquare } from 'lucide-react'
import { data, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { acceptConnectionRequest, fetchConnections, handleUnfollow, rejectConnectionRequest } from '../Services/Operations/connectionAPIs'
import { setConnection, setFollowers, setFollowing, setPendingConnections } from '../Slices/connectionSlice'

const Connections = () => {

  const {connection, pendingConnections, followers, following} = useSelector((state) => state.connections)

  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('Followers');
  const dispatch = useDispatch();
  const {getToken} = useAuth();

  const dataArray = [
    {label: "Followers", value: followers, icon: Users},
    {label: "Following", value: following, icon: UserCheck},
    {label: "Pending", value: pendingConnections, icon: UserRoundPen},
    {label: "Connections", value: connection, icon: UserPlus},
  ];

  const handleUnfollowUser = async(userId) => {
      const token = await getToken();
      dispatch(handleUnfollow(userId, token));
      dispatch(fetchConnections(await getToken()));
  }

  const acceptConnection = async(userId) => {
      try {
        const response = await dispatch(acceptConnectionRequest(userId, await getToken()));
        dispatch(fetchConnections(await getToken()));
      } catch (error) {
        console.error(error);
      }
  }

  const rejectConnection = async(userId) => {
      try {
        const response = await dispatch(rejectConnectionRequest(userId, await getToken()));
        dispatch(fetchConnections(await getToken()));
      } catch (error) {
        console.error(error); 
      }
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = await getToken();
            dispatch(fetchConnections(token));
        } catch (error) {
            console.error("Failed to fetch connections:", error);
        }
    };

    fetchData();

  }, [getToken, dispatch]);

  return (
    <div className='min-h-screen bg-slate-50'>
        <div className='max-w-6xl mx-auto p-6'>

          {/* title */}
          <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Connections</h1>
          <p className='text-slate-600'>Manage your network and discover new connections</p>
        </div>

        {/* counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {
            dataArray.map((data, index) => (
              <div key={index} className='flex flex-col items-center justify-center gap-1 border
              h-20 w-40 border-gray-200 bg-white shadow rounded-md'>

                <b>{data.value.length}</b>
                <p className='text-slate-600'>{data.label}</p>
              </div>
            ))
          }
        </div>

        {/* tabs */}
        <div className='inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 
        bg-white shadow-sm'>
        {
          dataArray.map((data) => (
            <button key={data.label} className={`flex items-center px-3 py-1 text-sm rounded-md 
            transition-colors ${currentTab === data.label 
            ? "bg-white font-medium text-black" : "text-gray-500 hover:text-black"} `}
            onClick={() => setCurrentTab(data.label)}
            >
            <data.icon className='w-4 h-4' />

            <span className='ml-1'> {data.label} </span>

            {data.count !== undefined && 
            (<span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'> 
            {data.count} </span>)}

            </button>
          ))
        }
          
        </div>

        {/* connections */}
        <div className='flex flex-wrap gap-6 mt-6'>
          {
            dataArray.find((data) => data.label === currentTab).value.map((user) => (

              <div key={user._id} className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>

                <img src={user.profile_picture} className='rounded-full w-12 h-12 shadow-md mx-auto' 
                loading='lazy' alt='userImage' />

                <div className='flex-1'>
                  <p className='font-medium text-slate-700'> {user.full_name} </p>
                  <p className='font-medium text-slate-500'> @{user.username} </p>
                  <p className='font-medium text-slate-500'> {user.bio.slice(0, 30)}... </p>


                  <div className='flex max-sm:flex-col gap-2 mt-4'>
                    {
                      <button className='w-full p-2 text-sm rounded bg-gradient-to-r
                      from-indigo-500 to-purple-600 hover:from-indigo-600 
                      hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'
                      onClick={() => navigate(`/profile/${user._id}`)}
                      >
                        View Profile
                      </button>
                    }

                    {
                      currentTab === 'Following' && (
                        <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200
                        text-black active:scale-95 transition cursor-pointer'
                        onClick={() => handleUnfollowUser(user._id)}
                        >
                          Unfollow
                        </button>
                      )
                    }

                    {
                      currentTab === 'Pending' && (
                        <>
                          <button className='w-full p-2 text-sm rounded bg-slate-300 hover:bg-slate-400
                        text-black active:scale-95 transition cursor-pointer'
                        onClick={() => acceptConnection(user._id)}
                        >
                          Accept
                        </button>
                        <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200
                        text-black active:scale-95 transition cursor-pointer'
                        onClick={() => rejectConnection(user._id)}
                        >
                          Reject
                        </button>
                        </>

                        
                      )
                    }

                    {
                      currentTab === 'Connections' && (
                        <>
                          <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200
                          active:scale-95 transition cursor-pointer text-slate-800 flex justify-center items-center gap-1'
                          onClick={() => navigate(`/messages/${user._id}`)}
                          >
                          <MessageSquare className='w-4 h-4' />
                          Message
                        </button>
                        </>  
                      )
                    }

                    
                  </div>

                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Connections