"use client"

import { apiRequestHandler } from "@/utils/requestHandlers";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { FaBookmark } from "@react-icons/all-files/fa/FaBookmark";
import { FaFacebookF } from "@react-icons/all-files/fa/FaFacebookF";
import { FaHeart } from "@react-icons/all-files/fa/FaHeart";
import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram";
import { FaRegBookmark } from "@react-icons/all-files/fa/FaRegBookmark";
import { FaRegEnvelope } from "@react-icons/all-files/fa/FaRegEnvelope";
import { FaRegHeart } from "@react-icons/all-files/fa/FaRegHeart";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FiPrinter } from "@react-icons/all-files/fi/FiPrinter";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import toast from "react-hot-toast";
import Notifications from "../shared/Notifications";


export default function PostSocials({ postId, postTitle, user, postCategory }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const router = useRouter()
    const newsLink = `${process.env.AUTH_URL}/posts/${postId}`;
    const formattedTitle = postTitle?.replace(/ /g, '+');


    const updateUser = async (fieldName) => {
        try {
            const response = await apiRequestHandler('/users', {
                filter: [
                    { email: `${user.email}` }
                ]
            });

            if (response?.[0]) {
                const user = response?.[0];
                const patchResponse = await axios.patch(`/api/users`, {
                    id: user.id,
                    data: {
                        [fieldName]: user[fieldName] + 1
                    }
                });

                if (!patchResponse) {
                    throw new Error('Failed to update the user data');
                }
                toast.success('User data updated successfully');
            }
        } catch (error) {
            console.error('Error updating user:', error.message);
            toast.error(error.message);
        }
    };

    const toggleHeart = async () => {
        if (user) {
            try {
                const response = await axios.post('/api/news/favorite-news', {
                    user_email: user.email,
                    news_id: postId,
                    news_title: postTitle,
                    news_category: postCategory,
                });
                // 

                if (response.status === 201) {
                    toast.success(response.data.message);
                    updateUser('total_favorite_news');
                    setIsLiked(true);
                } else {
                    setIsLiked(true);
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                    <Notifications
                        icon={<InformationCircleIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />}
                        onClose={() => toast.dismiss(t.id)} title="Login Required!" description="Please login to like this post" />
                </div>
            ))
            // router.push(LOGIN_ROUTE);
        }
    }
    const toggleBookmarked = async () => {
        if (user) {
            try {
                const response = await axios.post('/api/news/bookmarked-news', {
                    user_email: user.email,
                    news_id: postId,
                    news_title: postTitle,
                    news_category: postCategory,
                });
                // 

                if (response.status === 201) {
                    toast.success(response.data.message);
                    setIsBookmarked(true);
                    updateUser('total_bookmarked_news');
                } else {
                    setIsBookmarked(true);
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                    <Notifications
                        icon={<InformationCircleIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />}
                        onClose={() => toast.dismiss(t.id)} title="Login Required!" description="Please login to bookmark this post" />
                </div>
            ))
            // router.push(LOGIN_ROUTE)
        }
    }
    const shareToFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsLink)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const shareToTwitter = () => {
        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(newsLink)}&text=Check%20this%20news%20out!`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const shareToInstagram = () => {
        const url = `https://www.instagram.com/?url=${encodeURIComponent(newsLink)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };
    return (
        <ul className="flex gap-1">
            <li>
                <button onClick={shareToFacebook}>
                    <FaFacebookF className="inline-block" />
                </button>
            </li>
            <li>
                <button onClick={shareToTwitter}>
                    <FaTwitter className="inline-block" />
                </button>
            </li>
            <li>
                <button onClick={shareToInstagram}>
                    <FaInstagram className="inline-block" />
                </button>
            </li>
            <li>
                <button onClick={toggleHeart}>
                    {isLiked ? <FaHeart className="inline-block" /> : <FaRegHeart className="inline-block" />}
                </button>
            </li>
            <li>
                <button onClick={toggleBookmarked}>
                    {isBookmarked ? <FaBookmark className="inline-block" /> : <FaRegBookmark className="inline-block" />}
                </button>
            </li>
            <li>
                <button>
                    <a href={`https://mail.google.com/mail/u/0/?ui=2&fs=1&tf=cm&su=${formattedTitle}&body=Link:${process.env.AUTH_URL}/posts/${postId}`} rel="nofollow noopener" target="_blank">
                        <FaRegEnvelope className="inline-block" />
                    </a>
                </button>
            </li>
            <li>
                <button onClick={() => router.push(`/posts/print/${postId}`)}>
                    <FiPrinter className="inline-block" />
                </button>
            </li>
        </ul>
    )
}