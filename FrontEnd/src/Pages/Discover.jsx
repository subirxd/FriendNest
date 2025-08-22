import React, { useState } from 'react'
import { Search } from 'lucide-react';
import UserCard from '../Components/UserCard';
import Loading from "../Components/Loading"
import { useDispatch } from 'react-redux';
import { searchUser } from '../Services/Operations/userAPIs';
import { useAuth } from '@clerk/clerk-react';
import { fetchConnections } from '../Services/Operations/connectionAPIs';

const Discover = () => {

  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {getToken} = useAuth();

const handleSearch = async (e) => {
    if (e.key === "Enter") {
        setLoading(true);
        try {
            setUsers([]);
            const token = await getToken();
            const response = await dispatch(searchUser({input}, token));
            dispatch(fetchConnections(token));
            console.log(response);

            if (response?.success) {
                setUsers(response.data);
            } else {
                console.error("API call failed:", response?.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            setLoading(false);
        }
    }
};

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>

        {/* title */}
          <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
          <p className='text-slate-600'>Connect with amazing people and grow your network</p>
        </div>

        {/* search */}
        <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
          <div className='p-6'>

            <div className='relative'>

              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />

              <input type='text' placeholder='Search people by using their name, username, or location...'
              className='w-full pl-10 sm:pl-12 py-2 border border-gray-300 rounded-md max-sm:text-sm'
              onChange={(e) => setInput(e.target.value)} value={input}
              onKeyUp={handleSearch}
               />
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-6'>
          {users.map((user) => <UserCard user={user} key={user._id} />)}
        </div>  

        {
          loading && (<Loading height='60vh' />)
        }      
      </div>
    </div>
  )
}

export default Discover