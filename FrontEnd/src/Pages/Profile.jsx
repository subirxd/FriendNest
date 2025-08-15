import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyPostsData, dummyUserData } from '../assets/assets';
import Loading from "../Components/Loading"
import UserProfileInfo from '../Components/UserProfileInfo';
import PostCard from '../Components/PostCard';
import moment from 'moment';

const Profile = () => {

  const {profileId} = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("Posts");
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async() => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
    //console.log(posts);
  }

  useEffect(()=>{

    fetchUser();
  }, [])

  return user ? (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6'>

      <div className='max-w-3xl mx-auto'>
        {/* profile_card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* cover photo */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>

            {user.cover_photo && <img src={user.cover_photo} alt='userCoverImage'
              className='w-full h-full object-cover'
            />}
          </div>

          {/* user info */}
          <UserProfileInfo
          user={user}
          profileId={profileId}
          posts={posts}
          setShowEdit={setShowEdit}
           /> 
        </div>

        {/* tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            {["Posts", "Media", "Likes"].map((tab) => (
              <button key={tab} className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors
              cursor-pointer ${activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"}`}
              onClick={() => setActiveTab(tab)}
              >

              {tab}
              </button>
            ))}
          </div>
        </div>

        {/* posts */}
        {activeTab === "Posts" && 
          (<div className='mt-6 flex flex-col items-center gap-6'>
              {posts.map((post) => (
                <PostCard key={post._id} feed={post}/>
              ))}
          </div>)
        }

        {/* media */}
        {
          activeTab === "Media" && (
            <div className='flex flex-wrap mt-6 max-w-6xl'>
              {
                posts.filter((post) => post.image_urls.length > 0).map((post) => (
                  <>
                    {
                      post.image_urls.map((image, index) =>  (
                        <Link key={index} target='_blank' to={image} className='relative group'>
                          <img src={image} key={index} loading='lazy' alt='postImage'
                          className='w-64 aspect-video object-cover mx-1 my-1'
                           />
                           <p className='absolute bottom-2 right-1 text-xs p-1 px-3 
                           backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 
                           transition duration-300'
                           >
                           Posted {moment(post.createdAt).fromNow() }</p>
                        </Link>
                      ))
                    }
                  </>
                ))
              }
            </div>
          )
        }
      </div>

      {/* edit profile modal */}
      {
        showEdit && <p>Show Profile Edit</p>
      }
    </div>
  ) : (
    <Loading />
  )
}

export default Profile