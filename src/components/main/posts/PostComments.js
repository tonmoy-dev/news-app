"use client"

import Image from "next/image";

export default function PostComments({ comments }) {
    // 
    if (comments.length === 0) {
        return <div></div>
    }

    return (
        <>
            {/*====== POST COMMENTS PART START ======*/}
            <section className="post-comments-area pb-10">
                <div className="main-container">
                    <div className="mx-4 md:mx-0">
                        <div className="w-full md:w-4/5  mx-auto">
                            <div className="section-title">
                                <h3 className="title">Post Comments</h3>
                            </div>
                            {
                                comments.map(comment => (
                                    <div key={comment?.id} className="post-comments-list">
                                        <div className="post-comments-item">
                                            <div className="thumb">
                                                <Image
                                                    className='w-[45px] h-[43px] rounded-full'
                                                    src={"https://placehold.co/45x43.png"}
                                                    alt={"author"}
                                                    width={45}
                                                    height={43}
                                                />
                                            </div>
                                            <div className="post">
                                                {/* <a href="#">Reply</a> */}
                                                <h5 className="title font-medium">{comment?.user_name}</h5>
                                                <p className="text-base">
                                                    {comment?.comment_message}
                                                </p>
                                            </div>
                                        </div>
                                        {
                                            (comment?.comment_reply !== null) && (
                                                <div className="post-comments-item ms-20">
                                                    <div className="thumb">
                                                        <Image
                                                            className='w-[45px] h-[43px] rounded-full'
                                                            src={"https://placehold.co/45x43.png"}
                                                            alt={"author"}
                                                            width={45}
                                                            height={43}
                                                        />
                                                    </div>
                                                    <div className="post">
                                                        {/* <a href="#">Reply</a> */}
                                                        <h5 className="title font-medium">Reporter</h5>
                                                        <p className="text-base">
                                                            {comment?.comment_reply}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                ))
                            }
                            {/* <div className="post-load-btn">
                                <a className="main-btn" href="#">
                                    LOAD MORE
                                </a>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
            {/*====== POST COMMENTS PART ENDS ======*/}
        </>

    )
}