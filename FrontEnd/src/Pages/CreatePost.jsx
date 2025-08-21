import React, { useState } from 'react'
import { Image, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {useAuth} from "@clerk/clerk-react"
import { addPost } from '../Services/Operations/postAPIs';
import {useNavigate} from "react-router-dom"
const CreatePost = () => {

  const dispatch = useDispatch();
  const {getToken} = useAuth();
  const navigate = useNavigate();


  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.value);

  const handleSubmit = async() => {
    if(!images.length && !content){
        return toast.error("Please add at least one image or some text.");
    }

    setLoading(true);
    const postType = images.length && content ? "text_with_image"
        : images.length ? "image" : "text";

    const formData = new FormData();
    formData.append("content", content);
    formData.append("post_type", postType);
    images.map((image) => formData.append("images", image));

    try {
        const toastId = toast.loading("Uploading post...", {
            position: "bottom-center"
        });

        const token = await getToken();
        const response = await dispatch(addPost(formData, token));

        // Check if the addPost thunk returned a success response
        if (response && response.success) {
            toast.dismiss(toastId);
            navigate("/");
        } else {
            // Handle API-level errors
            toast.error(response?.message || "Failed to upload post.");
        }
    } catch (error) {
        // Handle unexpected errors
        console.error(error);
        toast.error("An error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
}

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'> 
      <div className='max-w-6xl mx-auto p-6'>

      {/* title */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create Post</h1>
        <p className='text-slate-600'>Share your thoughts with the world</p>
      </div>

      {/* form */}
      <div className='max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4'>
        {/* header */}
        <div className='flex items-center gap-3'>
        <img src={user.profile_picture} alt='userImage'
        className='w-12 h-12 rounded-full shadow' />
        <div>
          <h2 className='font-semibold'>{user.full_name}</h2>
          <p className='text-sm text-gray-500'>@{user.username}</p>
        </div>
        </div>

        {/* textarea */}
        <textarea className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400'
        placeholder='Enter Your Thoughts..'
        onChange={(e) => setContent(e.target.value)}
        value={content} />

        {/* images */}
        {
          images.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-4'>
              {images.map((image, index) => (
                <div key={index} className='relative group'>

                  <img src={URL.createObjectURL(image)}
                  className='h-20 rounded-md' alt='postImage'
                   />
                   <div className='absolute hidden group-hover:flex justify-center items-center
                   top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer'
                   onClick={() => setImages(images.filter((_, i) => i != index))}
                   >
                    <X className='w-6 h-6 text-white'/>
                   </div>
                </div>
              ))}
            </div>
          )
        }

        {/* bottom bar */}
        <div className='flex items-center justify-between pt-3 border-t border-gray-300'>
          <label className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700
          transition curosr-pointer' htmlFor='images'>
            <Image className='size-6' />
          </label>

          <input type='file' id='images' accept='image/*' hidden multiple 
          onChange={(e) => setImages([...images, ...e.target.files])} />

          <button className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600
          hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white
          font-medium px-8 py-2 rounded-md cursor-pointer'
          disabled = {loading}
          onClick={handleSubmit}
          >
            {loading ? "Uploading..." : "Publish Post"}
          </button>
        </div>

      </div>
      </div>
    </div>
  )
}

export default CreatePost