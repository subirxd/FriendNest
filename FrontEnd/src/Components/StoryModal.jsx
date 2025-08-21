import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, Sparkle, TextIcon, UploadIcon } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addStory } from '../Services/Operations/storyAPIs';

const StoryModal = ({setShowModal, fetchStories}) => {
    const bgColors = ["#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04", "#0d9488"];

    const [mode, setMode] = useState("text");
    const [background, setBackground] = useState(bgColors[0]);
    const [text, setText] = useState("");
    const [media, setMedia] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const dispatch = useDispatch();
    const {getToken} = useAuth();
    const max_duration = 60;
    const max_size_in_mb = 50;

    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0];

        if(file){
            if(file.type.startsWith('video')){
                if(file.size > max_size_in_mb * 1024 * 1024){
                    toast.error("Video file size cannot exceed 50MB");
                    setMedia(null);
                    setPreviewUrl(null);
                    return;
                }

                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = () => {
                    window.URL.createObjectURL(video.src)
                    if(video.duration > max_duration){
                        toast.error("Video size can't exceed 1 minute")
                        setMedia(null);
                        previewUrl(url);

                    } else {
                        setMedia(file);
                        setPreviewUrl(URL.createObjectURL(file));
                        setText("");
                        setMode("media")
                    }
                }

                video.src = URL.createObjectURL(file);
            } else if(file.type.startsWith('image')) {
                        setMedia(file);
                        setPreviewUrl(URL.createObjectURL(file));
                        setText("");
                        setMode("media")
            }
        }
    }

    const handleCreateStory = async() => {
        const media_type = mode === "media" ? media?.type.startsWith('image') ? 'image' : "video" : "text"

        if(media_type === 'text' && !text){
            toast.error("Please enter some text to upload.");
            return;
        }

        let formData = new FormData();
        formData.append("content", text);
        formData.append("media_type", media_type);
        if(media_type !== 'text' && media){
            formData.append("media", media);
        }
        formData.append("background_color", background);
        const token = await getToken();

        const toastId = toast.loading("Uploading Story", {position: 'bottom-center'});
        try {
            const data = await dispatch(addStory(formData, token));

            if(data){
                toast.success(data.message);
            }
            else{
                toast.error(data?.message || "Failed to create story.");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally{
            setShowModal(false);
            toast.dismiss(toastId);
        }
    }

  return (
    <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white 
    flex items-center justify-center p-4'>
        <div className='w-full max-w-md'>

            <div className='text-center mb-4 flex items-center justify-between'>
                <button className='text-white p-2 cursor-pointer'
                onClick={() => setShowModal(false)}
                >
                    <ArrowLeft />
                </button>
                <h2 className='text-lg font-semibold'>Create a Story</h2>
                <span className='w-10'></span>
            </div>

            <div className='rounded-lg h-96 flex items-center justify-center relative' style={{backgroundColor: background}}>
                {
                    mode === "text" && (
                        <textarea name='story' id='story' 
                          className='bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none' 
                          placeholder={`What's in your mind?`}
                          onChange={(e) => setText(e.target.value)
                          }
                          value={text}
                        />
                    )
                }

                {
                    mode === "media" && previewUrl && (
                        media?.type.startsWith('image') ? 
                        (
                            <img src={previewUrl}
                            className='object-contain max-h-full'
                             />
                        ) : (
                            <video src={previewUrl}
                            className='object-contain max-h-full'
                             />
                        )
                    )
                }
            </div>

            <div className='flex mt-4 gap-2'>
                {bgColors.map((color, index) => (
                    <button key={index} className='w-6 h-6 rounded-full ring cursor-pointer'
                    style={{backgroundColor: color}}
                    onClick={() => setBackground(color)}
                    >

                    </button> )
                )}
            </div>

            <div className='flex gap-2 mt-4'>
                <button 
                onClick={() => {
                setMode("text"); 
                setMedia(null); 
                setPreviewUrl(null); }}

                 className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer 
                ${mode === "text" ? "bg-white text-black" : "bg-zinc-800"} `}>
                    <TextIcon size={18} />
                    Text
                </button>
                <label
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer
                ${mode === "mdedia" ? "bg-white text-black" : "bg-zinc-800"}
                `}
                >
                <input type='file' accept='image/* video/*' className='hidden'
                    onChange={(e) => {
                        handleMediaUpload(e);
                        setMode("media");
                        setText("");
                    }}
                />

                <UploadIcon size={18} /> 
                Photo / Video
                </label> 
            </div>
            <button
            className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded 
            bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700
            active:scale-95 transition cursor-pointer'
            onClick={handleCreateStory}
            >
                <Sparkle size={18} /> Create Story
            </button>
        </div>
    </div>
  )
}

export default StoryModal