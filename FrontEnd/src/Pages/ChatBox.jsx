import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { Image, ImageIcon, SendHorizonal, X } from 'lucide-react';

const ChatBox = () => {

  const messages = dummyMessagesData;
  const [text, setText] = useState("");
  const [images, setImages] = useState(null);
  const [user, setUser] = useState(dummyUserData);
  const [preview, setPreview] = useState(null);
  const messageEndRef = useRef(null);

  const sendMessage = async() => {

  }

   useEffect(() => {
    if (images) {
      const objectUrl = URL.createObjectURL(images);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [images]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({behaviour: "smooth"})
  }, [messages])

  return user && (
    <div className='flex flex-col h-screen'>

      {/* user image and username */}
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50
      to-purple-50 border-b border-gray-300'>
        <img src={user.profile_picture}
        alt='userImage'
        className='size-8 rounded-full' />

        <div>
          <p className='font-medium'> {user.full_name} </p>
          <p className='text-sm text-gray-500 -mt-1.5'> @{user.username}</p>
        </div>
      </div>

      {/* message */}
      <div className='p-5 md:px-10 h-full overflow-y-scroll'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {
           messages.toSorted((a,b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index)=> (
            <div key={index} className={`flex flex-col ${message.to_user_id !== user._id 
            ? "items-start" : "items-end"}`}>

            <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow
            ${message.to_user_id !== user._id ? "rounded-bl-none" : "rounded-br-none"}`}>
              {
                message.message_type === "image" && 
                <img src={message.media_url} 
                  className='w-full max-w-sm rounded-lg mb -1 '
                />
              }
              
              <p> {message.text} </p>
            </div>

            </div>
           ))
          }
          <div ref={messageEndRef} />
        </div>
      </div>

      <div className='px-4'>
          <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto
          border border-gray-200 shadow rounded-full mb-5'>

            <input type='text' className='flex-1 outline-none text-slate-700'
            placeholder='Type a message...'
            onKeyDown={(e) => e.key==="Enter" && sendMessage()}
            onChange={(e) => setText(e.target.value)}
            value={text} />

           <label htmlFor="Image">
            {images ? (
              <div className="relative group h-20 w-20">
                <img
                  src={preview}
                  className="h-20 w-20 object-cover rounded"
                  alt="preview"
                />
                <button
                  className="hidden group-hover:flex absolute inset-0 bg-black/40 items-center justify-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImages(null);
                  }}
                >
                  <X className="text-white" />
                </button>
              </div>
            ) : (
              <ImageIcon className="size-7 text-gray-400 cursor-pointer" />
            )}

            <input
              type="file"
              accept="image/*"
              id="Image"
              hidden
              onChange={(e) => setImages(e.target.files[0])}
            />
          </label>

          <button className='bg-gradient-to-br from-indigo-500 to-purple-600
          hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white
          p-2 rounded-full'
          onClick={sendMessage}
          >
            <SendHorizonal className=''/>
          </button>
          </div>
        
      </div>
    </div>
  )
}

export default ChatBox