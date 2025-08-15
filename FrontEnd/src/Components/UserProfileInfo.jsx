import { Calendar, MapPin, PenBox, Verified } from 'lucide-react'
import React from 'react'
import moment from "moment"

const UserProfileInfo = ({user, posts, profileId, setShowEdit}) => {
  return (
    <div className='relative py-4 px-6 md:px-8 bg-white '>

        <div className='flex flex-col md:flex-row items-start gap-6'>
            <div className='w-32 h-32 border-4 border-white shadow-lg absolute 
            -top-16 rounded-full'>
                <img src={user.profile_picture} alt='userProfileImage'
                className='absolute rounded-full z-2 '
                 />
            </div>

            <div className='w-full pt-16 md:pt-0 md:pl-36'>
                <div className='flex flex-col md:flex-row items-start justify-between'>

                    <div>
                        <div className='flex items-center gap-3'>
                            <h1 className='text-2xl font-bold text-gray-900'>{user.full_name}</h1>
                            <Verified className='h-6 w-6 text-blue-500'/>
                        </div>
                        <p className='text-gray-600'> {user.username ? `@${user.username}` : "Add a username"} </p>
                    </div>

                    {/* edit button, only if user in his profile */}

                    {!profileId && 
                    <button
                    className='flex items-center gap-2 border border-gray-300 hover:bg-gray-50
                    px-4 py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0 cursor-pointer'
                    onClick={() => setShowEdit(true)}
                    >
                        <PenBox className='w-4 h-4' />
                        Edit
                    </button>
                    }
                </div>
                <p className='text-gray-700 text-sm max-w-md mt-4'> {user.bio} </p>

                {/* location and joined date */}
                <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4'>
                    <span className='flex items-center gap-1.5'>
                        <MapPin className='h-4 w-4' />
                        {user?.location ? user?.location : "Add Location"}
                    </span>

                    <span className='flex items-center gap-1.5'>
                        <Calendar className='h-4 w-4' />
                        Joined {" "}
                        {user?.createdAt && moment(user?.createdAt).fromNow()}
                    </span>
                </div>

                <div className='flex items-center gap-6 mt-6 border-t border-gray-200 pt-4'>
                    <div>
                        <span className='sm:text-xl font-bold text-gray-900'>{posts.length}</span>
                        <span className='text-xs sm:text-sm text-gray-500 ml-1.5'>Posts</span>
                    </div>

                    <div>
                        <span className='sm:text-xl font-bold text-gray-900'>{user.followers.length}</span>
                        <span className='text-xs sm:text-sm text-gray-500 ml-1.5'>Followers</span>
                    </div>

                    <div>
                        <span className='sm:text-xl font-bold text-gray-900'>{user.following.length}</span>
                        <span className='text-xs sm:text-sm text-gray-500 ml-1.5'>Following</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserProfileInfo