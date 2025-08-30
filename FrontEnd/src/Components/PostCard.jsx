import { BadgeCheck, Heart, MessageCircle, Share, Share2, Send, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { likePost } from '../Services/Operations/postAPIs';
import { addComment, deleteComment, getComments } from '../Services/Operations/commentAPIs';
import {useAuth} from "@clerk/clerk-react"
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import DOMPurify from 'dompurify';
import ShareModal from './ShareModal';

const PostCard = ({feed}) => {

    const navigate = useNavigate();
    const postWithHashTags = feed.content.replace(/(#\w+)/g, `<span class="text-indigo-600">$1</span>`);
    const sanitizedContent = DOMPurify.sanitize(postWithHashTags);
    const [likes, setLikes] = useState(feed.likes_count);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const currentUser = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const {getToken} = useAuth();

    const handleLike = async() => {
        try {
            const token = await getToken();
            const response = await dispatch(likePost(feed._id, token));

            if(response){
                setLikes(
                    prev => {
                        if(prev.includes(currentUser._id)){
                            return prev.filter(id => id !== currentUser._id)
                        }
                        else{
                            return [...prev, currentUser._id];
                        }
                    }
                );
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to like/unlike the post.");
        }
    }

    const fetchComments = async () => {
        try {
            const token = await getToken();
            const commentsData = await dispatch(getComments(feed._id, token));
            setComments(commentsData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load comments.");
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast.error("Please enter a comment.");
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            const response = await dispatch(addComment(feed._id, newComment, token));
            console.log(response);
            
            // Add the new comment to local state immediately
            const newCommentObj = {
                _id: response.data._id,
                comment: newComment,
                userId: {
                    _id: currentUser._id,
                    full_name: currentUser.full_name,
                    username: currentUser.username,
                    profile_picture: currentUser.profile_picture
                },
                createdAt: new Date().toISOString()
            };
            
            setComments(prev => [newCommentObj, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = await getToken();
            await dispatch(deleteComment(commentId, feed._id, token));
            setComments(prev => prev.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleComments = () => {
        if (!showComments) {
            fetchComments();
        }
        setShowComments(!showComments);
    };

    const handleShare = () => {
        setShowShareModal(true);
    };

    useEffect(() => {
        fetchComments();
    }, []);

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
                        <p dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
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
                <MessageCircle className='w-4 h-4 cursor-pointer' onClick={toggleComments} />
                <span> {comments.length} </span>
            </div>

            <div className='flex items-center gap-1'>
                <Share2 className='w-4 h-4 cursor-pointer' onClick={handleShare} />
            </div>
        </div>

        {/* Comments Section */}
        {showComments && (
            <div className='border-t border-gray-200 pt-4 space-y-4'>
                {/* Add Comment */}
                <div className='flex gap-2'>
                    <img 
                        src={currentUser?.profile_picture} 
                        alt='user_image' 
                        className='w-8 h-8 rounded-full'
                    />
                    <div className='flex-1 flex gap-2'>
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                            className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={loading || !newComment.trim()}
                            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1'
                        >
                            <Send className='w-4 h-4' />
                        </button>
                    </div>
                </div>

                {/* Comments List */}
                <div className='space-y-3 max-h-64 overflow-y-auto'>
                    {comments.length === 0 ? (
                        <p className='text-gray-500 text-center py-4'>No comments yet. Be the first to comment!</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className='flex gap-2'>
                                <img 
                                    src={comment.userId?.profile_picture} 
                                    alt='user_image' 
                                    className='w-8 h-8 rounded-full'
                                />
                                <div className='flex-1 bg-gray-50 rounded-lg p-3'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-1'>
                                            <span className='font-semibold text-sm'>{comment.userId?.full_name}</span>
                                            <span className='text-gray-500 text-xs'>@{comment.userId?.username}</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-gray-500 text-xs'>
                                                {moment(comment.createdAt).fromNow()}
                                            </span>
                                            {comment.userId?._id === currentUser._id && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className='text-red-500 hover:text-red-700'
                                                >
                                                    <Trash2 className='w-3 h-3' />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className='text-sm text-gray-800 mt-1'>{comment.comment}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* Share Modal */}
        <ShareModal 
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            post={feed}
        />
    </div>
  )
}

export default PostCard