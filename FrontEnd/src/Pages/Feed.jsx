import React, { useEffect, useState } from 'react'
import sponsoredImage from "../assets/sponsored_img.png"
import Loading from '../Components/Loading';
import StoriesBar from '../Components/StoriesBar';
import PostCard from '../Components/PostCard';
import RecentMessages from '../Components/RecentMessages';
import {useAuth} from "@clerk/clerk-react"
import { useDispatch } from 'react-redux';
import { fetchFeedData } from '../Services/Operations/postAPIs';
import toast from 'react-hot-toast';

const Feed = () => {

  const {getToken} = useAuth();
  const dispatch = useDispatch();

  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async() =>{
    const token = await  getToken();

    setLoading(true);

    try {
      const response = await dispatch(fetchFeedData(token));

      if(response){
        setFeeds(response.data);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchFeeds();
  }, [])

  return !loading ?  (
    <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
      {/* stories and post list */}
      <div>
       <StoriesBar />

        <div className='p-4 space-y-6'>
          {feeds.map((feed, index) => (
            <PostCard feed={feed} key={index} />
          ))}
        </div>
      </div>

      {/* right sidebar */}
      <div className='max-xl:hidden sticky top-0'>
        <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex 
        flex-col gap-2 shadow'>
          
          <h3 className='text-slate-800 font-semibold'>Sponsored</h3>
          <img src={sponsoredImage} className='w-75 h-50 rounded-md' alt='sponsored_image' />
          <p className='text-slate-600'>Email Marketing</p>
          <p className='text-slate-400'>Supercharge your marketing with a powerful, easy-to-use platform build for results.</p>
        </div>
        
        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default Feed