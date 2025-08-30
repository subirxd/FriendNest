import React, { useState } from 'react';
import { X, Copy, Facebook, Twitter, Linkedin, Link, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, post }) => {
    const [copied, setCopied] = useState(false);
    
    // Generate share URL
    const shareUrl = `${window.location.origin}/post/${post?._id}`;
    const shareText = `Check out this post by ${post?.user?.full_name} on FriendNest!`;
    
    // Copy link to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link');
        }
    };
    
    // Share on Facebook
    const shareOnFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };
    
    // Share on Twitter/X
    const shareOnTwitter = () => {
        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };
    
    // Share on LinkedIn
    const shareOnLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };
    
    // Share on WhatsApp
    const shareOnWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        window.open(url, '_blank');
    };
    
    // Share via Email
    const shareViaEmail = () => {
        const subject = `Check out this post on FriendNest`;
        const body = `${shareText}\n\n${shareUrl}`;
        const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = url;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Share Post</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Post Preview */}
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <img 
                            src={post?.user?.profile_picture} 
                            alt="user" 
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p className="font-semibold text-sm">{post?.user?.full_name}</p>
                            <p className="text-gray-500 text-xs">@{post?.user?.username}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                        {post?.content?.substring(0, 100)}
                        {post?.content?.length > 100 && '...'}
                    </p>
                    {post?.image_urls?.length > 0 && (
                        <div className="mt-3">
                            <img 
                                src={post.image_urls[0]} 
                                alt="post" 
                                className="w-full h-20 object-cover rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Share Options */}
                <div className="space-y-3">
                    {/* Copy Link */}
                    <button
                        onClick={copyToClipboard}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <div className="p-2 bg-blue-100 rounded-lg">
                            {copied ? (
                                <Check className="w-5 h-5 text-green-600" />
                            ) : (
                                <Copy className="w-5 h-5 text-blue-600" />
                            )}
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">
                                {copied ? 'Link Copied!' : 'Copy Link'}
                            </p>
                            <p className="text-sm text-gray-500">Share this link with anyone</p>
                        </div>
                    </button>

                    {/* Social Media Options */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={shareOnFacebook}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Facebook className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">Facebook</span>
                        </button>

                        <button
                            onClick={shareOnTwitter}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Twitter className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">Twitter</span>
                        </button>

                        <button
                            onClick={shareOnLinkedIn}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Linkedin className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">LinkedIn</span>
                        </button>

                        <button
                            onClick={shareOnWhatsApp}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                </svg>
                            </div>
                            <span className="font-medium text-gray-900">WhatsApp</span>
                        </button>
                    </div>

                    {/* Email Share */}
                    <button
                        onClick={shareViaEmail}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="font-medium text-gray-900">Share via Email</span>
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        This post will be shared with the selected platform
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
