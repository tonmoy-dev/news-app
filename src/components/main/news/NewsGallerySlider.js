"use client"

import { formattedDate } from "@/utils/format-date";
import { FaAngleLeft } from "@react-icons/all-files/fa/FaAngleLeft";
import { FaAngleRight } from "@react-icons/all-files/fa/FaAngleRight";
import { FaPlay } from "@react-icons/all-files/fa/FaPlay";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";

export default function NewsGallerySlider({ news }) {
    // slider configs
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <FaAngleRight size={16} className={className}
                style={{ ...style, padding: "10px" }}
                onClick={onClick} />
        );
    }
    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <FaAngleLeft size={16} className={className}
                style={{ ...style, padding: "10px" }}
                onClick={onClick} />
        );
    }
    const settings = {
        // customPaging: function (i) {
        //     return (
        //         <a>
        //             <img src={`/assets/images/gallery-post/item-${i + 1}.jpg`} />
        //         </a>
        //     );
        // },
        // dots: true,
        // dotsClass: "slick-dots slick-thumb",
        infinite: true,
        arrows: false,
        autoplay: false,
        speed: 4000,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        // nextArrow: <SampleNextArrow />,
        // prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    // arrows: false,
                    arrows: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    arrows: false, // Hide arrows
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false, // Hide arrows
                }
            }
        ]
    };

    return (
        <Slider {...settings}>
            {
                news?.slice(0, 5)?.map(post => (
                    <div className="post_gallery_play" key={post?.id}>
                        <div className="bg-img">
                            <Image
                                className='w-[688px] h-[500px] object-cover absolute top-0 left-0 z-[-2]'
                                src={post?.thumbnail_img_original ? (`/assets/images/${post?.thumbnail_img_original}`) : "https://placehold.co/688x500.png"}
                                alt={post?.title}
                                width={688}
                                height={500}
                            // blurDataURL="data:..." automatically provided
                            // placeholder="blur" // Optional blur-up while loading
                            />
                        </div>
                        <div className="post__gallery_play_content">
                            <div className="post-meta">
                                <div className="meta-categories">
                                    <Link
                                        href={`/category/${post?.category}`}
                                        className='text-sm'>
                                        {post?.category}
                                    </Link>
                                </div>
                                <div className="meta-date">
                                    <span>
                                        {formattedDate(post?.published_date)}
                                    </span>
                                </div>
                            </div>
                            <h2 className="title">
                                <Link href={`/posts/${post?.id}`}>
                                    {post?.title}!
                                </Link>
                            </h2>
                            <p>
                                {post?.content}
                            </p>
                        </div>
                        {
                            post?.youtube_video_url && (
                                <div className="post_play_btn">
                                    <a className="video-popup" target="_blank" href={`${post?.youtube_video_url}`}>
                                        <FaPlay className="m-auto h-5 mt-4" />
                                    </a>
                                </div>
                            )
                        }

                    </div>
                ))
            }
        </Slider>
    )
}