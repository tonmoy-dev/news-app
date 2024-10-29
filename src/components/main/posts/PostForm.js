"use client"

import { InformationCircleIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import Notifications from "../shared/Notifications";

export default function PostForm({ postId }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        opinion: ""
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const session = useSession();

    const getCurrentDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        return today.toLocaleDateString('en-US', options);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.data?.user) {
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                    <Notifications
                        icon={<InformationCircleIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />}
                        onClose={() => toast.dismiss(t.id)} title="Login Required!" description="Please login to comment on this post" />
                </div>
            ))
            return;
        }

        // Check if fields are empty
        if (!formData.fullName || !formData.email || !formData.opinion) {
            setErrorMessage("All fields are required");
            return;
        }

        const data = {
            user_name: formData.fullName,
            user_email: formData.email,
            comment_message: formData.opinion,
            comment_reply: null,
            news_post_link: `posts/${postId}`,
            submitted_date_time: getCurrentDate(),
            status: false,
            news_post_id: postId,
        }
        toast.promise(
            addPostComment(data),
            {
                loading: 'Adding news comment...',
                success: <b>Comment added for admin approval!</b>,
                error: <b>Could not added.</b>,
            }
        );
        async function addPostComment(data) {
            try {
                setLoading(true);

                const response = await axios.post(`${process.env.AUTH_URL}/api/post-comments`, data);
                setSuccessMessage("Comment posted successfully!");
                setFormData({ fullName: "", email: "", opinion: "" });
                setErrorMessage(""); // Clear error message if successful
            } catch (error) {
                setErrorMessage("Failed to submit your opinion. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <div className="post-form-area">
                <div className="main-container">
                    <div className="mx-4 md:mx-0">
                        <div className="w-full md:w-4/5 mx-auto">
                            <div className="section-title">
                                <h3 className="title">Leave an opinion</h3>
                            </div>
                            <div className="post-form-box">
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col md:flex-row gap-5">
                                        <div className="w-full md:w-1/2">
                                            <div className="input-box">
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    placeholder="Full name"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full md:w-1/2">
                                            <div className="input-box">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email address"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="input-box">
                                            <textarea
                                                name="opinion"
                                                cols={30}
                                                rows={10}
                                                placeholder="Tell us about your opinion…"
                                                value={formData.opinion}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button className="" type="submit" disabled={loading}>
                                            {loading ? "Posting..." : "POST OPINION"}
                                        </button>
                                    </div>
                                </form>

                                {/* Error or Success Messages */}
                                {/* {errorMessage && (
                                    <p className="text-red-500 mt-2">{errorMessage}</p>
                                )}
                                {successMessage && (
                                    <p className="text-green-500 mt-2">{successMessage}</p>
                                )} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
