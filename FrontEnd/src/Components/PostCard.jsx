import { BadgeCheck, Heart, MessageCircle, Share, Share2 } from 'lucide-react'
import React, { useState } from 'react'
import moment from 'moment'
import { dummyUserData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const PostCard = ({feed}) => {

    const navigate = useNavigate();
    const postWithHashTags = feed.content.replace(/(#\w+)/g, `<span class="text-indigo-600">$1</span>`);
    const [likes, setLikes] = useState(feed.likes_count);
    const currentUser = dummyUserData;

    const handleLike = async() => {

    }

  return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>

        {/* user info */}
        <div className='inline-flex items-center gap-3 cursor-pointer'
        onClick={() => navigate(`/profile/${feed.user._id}`)}
        >
            <img src={feed?.user?.profile_picture} alt='user_image' 
                className='w-10 h-10 rounded-full shaodw'
            />
            <div>
                <div className='flex items-center space-x-1'>
                    <span> {feed?.user?.full_name}</span>
                    <BadgeCheck className='w-4 h-4 text-blue-500'/>
                </div>
                <div className='text-gray-500 text-sm'>
                    @{feed?.user?.username} • {moment(feed?.createdAt).fromNow()}
                </div>
            </div>
        </div>

        {/* content */}
            {
                feed?.content && (
                    <div className='text-gray-800 text-sm whitespace-pre-line'>
                        <p dangerouslySetInnerHTML={{ __html: postWithHashTags }} />
                    </div>
                )
            }
        <div className='grid grid-cols-2 gap-2'>
            {
                feed?.image_urls.map((image, index) => {
                    return (
                        <img src ={image} key={index} alt="user_post"
                        className={`w-full h-48 object-cover rounded-lg ${feed.image_urls.length === 1 && 'col-span-2 h-auto'}`} 
                        />
                    )
                })
            }
        </div>


        {/* actions */}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300 justify-evenly'>
            <div className='flex items-center gap-1'>
                <Heart className={`w-4 h-4 cursor-pointer ${likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} 
                    onClick={handleLike}
                />
                <span> {likes.length} </span>
            </div>

            <div className='flex items-center gap-1'>
                <MessageCircle className='w-4 h-4 cursor-pointer' />
                <span> {12} </span>
            </div>

            <div className='flex items-center gap-1'>
                <Share2 className='w-4 h-4 cursor-pointer' />
                <span> {7} </span>
            </div>
        </div>
    </div>
  )
}

export default PostCard