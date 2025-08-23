import React from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'

const Notification = ({t, message}) => {
    const navigate = useNavigate();
  return (
    <div className={`max-w-md w-full bg-white shadow-lg rounded-lg flex border
    border-gray-300 hover:scale-105 transition`}> 
        <div className='flex-1 p-4'>
            <div className='flex items-start'>
                <img src={message.from_user_id.profile_picture}
                className='h-10 w-10 rounded-full flex-shrink-0 mt-0.5' />
                <div className='ml-3 flex-1'>
                    <p className='text-sm font-medium text-gray-900'>
                    {message.from_user_id.full_name}
                    <p className='text-sm text-gray-500'>
                        {message.text.slice(0, 50)}
                    </p>
                    </p>
                </div>
            </div>
        </div>

        <div>
            <button className='p-4 text-indigo-600 font-semibold'
            onClick={() => {navigate(`/messages/${message.from_user_id._id}`);
              toast.dismiss(t.id);
            }}
            >
                Reply
            </button>
        </div>
    </div>
  )
}

export default Notification