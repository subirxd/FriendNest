import React, { useEffect, useRef, useState } from 'react';
import { Image, ImageIcon, SendHorizonal, X } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react"; // Import useUser
import { fetchMessages, sendMessages } from '../Services/Operations/messagesAPIs';
import { addMessage as addMessageAction, setMessages as setMessagesAction, resetMessages } from '../Slices/messagesSlice';
const ChatBox = () => {
    // Redux state
    const { messages } = useSelector((state) => state.messages);
    
    // Auth and Router
    const { userId } = useParams(); // ID of the other user
    const { user: currentUser } = useUser();
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    
    // Local state
    const [text, setText] = useState("");
    const [media, setMedia] = useState(null);
    const [targetUser, setTargetUser] = useState(null);
    const [preview, setPreview] = useState(null);
    
    const messageEndRef = useRef(null);

    const handleSendMessage = async () => {
        try {
            if (!text && !media) {
                return;
            }

            const token = await getToken();
            const formData = new FormData();

            formData.append("to_user_id", userId);
            formData.append("text", text);
            media && formData.append("media", media);

            const response = await dispatch(sendMessages(formData, token));
            console.log(response);
            if (response?.success) {
                setText("");
                setMedia(null);
                await dispatch(addMessageAction(response.data));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleFetchMessages = async () => {
        try {
            const token = await getToken();
            const response = await dispatch(fetchMessages(userId, token));

            console.log(response);

            if (response.success) {
                dispatch(setMessagesAction(response.data));
                setTargetUser(response.profileData);
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        if (currentUser) {
            handleFetchMessages();
            // Clean up messages when user leaves chat
            return () => dispatch(resetMessages());
        }
    }, [userId, currentUser, dispatch, getToken]);

    useEffect(() => {
        if (media) {
            const objectUrl = URL.createObjectURL(media);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [media]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className='flex flex-col h-screen'>
            {targetUser && (
                <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50
                to-purple-50 border-b border-gray-300'>
                    <img src={targetUser.profile_picture}
                    alt='userImage'
                    className='size-8 rounded-full' />
                    <div>
                        <p className='font-medium'> {targetUser.full_name} </p>
                        <p className='text-sm text-gray-500 -mt-1.5'> @{targetUser.username}</p>
                    </div>
                </div>
            )}

            <div className='p-5 md:px-10 h-full overflow-y-scroll'>
                <div className='space-y-4 max-w-4xl mx-auto'>
                    {messages?.map((message, index) => (
                        <div key={index} className={`flex flex-col ${message.from_user_id !== currentUser?.id
                            ? "items-start" : "items-end"}`}>
                            <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow
                            ${message.from_user_id !== currentUser?.id ? "rounded-bl-none" : "rounded-br-none"}`}>
                                {message.media_url && (
                                    <img src={message.media_url}
                                        className='w-full max-w-sm rounded-lg mb-1'
                                    />
                                )}
                                <p>{message.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>
            </div>

            <div className='px-4'>
                <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto
                border border-gray-200 shadow rounded-md mb-5'>

                    <input type='text' className='flex-1 outline-none text-slate-700'
                    placeholder='Type a message...'
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    onChange={(e) => setText(e.target.value)}
                    value={text} />

                    <label htmlFor="Image">
                        {preview ? (
                            <div className="relative group h-10 w-10">
                                <img
                                    src={preview}
                                    className="h-10 w-10 object-cover rounded"
                                    alt="preview"
                                />
                                <button
                                    className="hidden group-hover:flex absolute inset-0 bg-black/40 items-center justify-center cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMedia(null);
                                        setPreview(null);
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
                            onChange={(e) => setMedia(e.target.files[0])}
                        />
                    </label>

                    <button className='bg-gradient-to-br from-indigo-500 to-purple-600
                    hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white
                    p-2 rounded-full'
                    onClick={handleSendMessage}
                    >
                        <SendHorizonal />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;