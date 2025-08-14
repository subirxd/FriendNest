import { AudioLines, BadgeCheck, X, VolumeX } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

const StoryViewer = ({viewStory, setViewStory}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer, progressInterval;

    if(viewStory && viewStory.media_type !== "video"){

        setProgress(0);
        const duration = 20000;
        const stepTime = 100;
        let elapsed = 0;

        progressInterval = setInterval(() => {
          elapsed += stepTime;
          setProgress((elapsed/ duration) * 100);
        }, stepTime);

        timer = setTimeout(() => {
          setViewStory(null);
        }, duration)
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    }
  }, [viewStory, setViewStory])

  const toggleMute = () => {
    setIsMuted(prevIsMuted => !prevIsMuted);
  };

  if(!viewStory){
    return null;
  }

  return (
    <div className='fixed inset-0 h-screen bg-black bg-opacity-90 z-110 flex 
    items-center justify-center' style={{backgroundColor: viewStory.media_type === "text" 
    ? viewStory.background_color : "#000000"}}>
        
        {/* progress bar */}
        <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
          <div className='h-full bg-white transition-all duration-100 linear'
          style={{width: `${progress}%`}}
          >

          </div>
        </div>
        {/* user info */}
        <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4
        sm:px-8 backdrop-blur-2xl rounded bg-black/50'>

        <img src={viewStory?.user?.profile_picture}
        alt='user_profile_image'
        className='size-7 sm:size-8 rounded-full object-cover border border-white'
         />
         <div className='text-white font-medium flex items-center gap-1.5'>
          <span> {viewStory?.user?.full_name} </span>
          <BadgeCheck
          size={18}
           />
         </div>
        </div>

        {/* close button */}
        <button
        onClick={() => setViewStory(null)}
        className='absolute top-4 right-4 text-white text-3xl font-bold '
        >
          <X className='w-8 h-8 hover:scale-110 transition cursor-pointer' />
        </button>

        {/* content wrapper */}
        <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
          {
            viewStory.media_type === 'text' && (
              <p className='w-full h-full flex items-center justify-center p-8
              text-white text-2xl text-center'> {viewStory.content} </p>
            )
          }

          {
            viewStory.media_type === 'image' && (
              <img src={viewStory.media_url} 
                className='max-w-full max-h-screen object-contain'
                
              />
            )
            
          }

          {
            viewStory.media_type === 'video' && (
             <div className='relative h-full w-full flex items-center justify-center'>
              <ReactPlayer
                src={viewStory.media_url}
                autoPlay
                playing
                muted={isMuted}
                playsInline
                width='100%'
               className='min-h-screen'
                style={{zIndex: "0", position: 'relative'}}
                onEnded={() => setViewStory(null)}
              />
              
              <button 
                className='absolute top-3 right-4 text-3xl text-amber-200 z-100'
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={18} /> : <AudioLines size={18} />}
              </button>
            </div>
            )
          }
        </div>
    </div>
  )
}

export default StoryViewer