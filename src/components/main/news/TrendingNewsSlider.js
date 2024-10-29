"use client"

import { formattedDate } from "@/utils/format-date";
import { FaAngleLeft } from '@react-icons/all-files/fa/FaAngleLeft';
import { FaAngleRight } from '@react-icons/all-files/fa/FaAngleRight';
import Image from "next/image";
import Link from "next/link";
import Slider from 'react-slick';

export default function TrendingNewsSlider({ trendingNewsData }) {
    // slider configs
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <FaAngleRight size={16} className={className}
                style={{ ...style, display: "block", padding: "5px" }}
                onClick={onClick} />
        );
    }
    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <FaAngleLeft size={16} className={className}
                style={{ ...style, display: "block", padding: "5px" }}
                onClick={onClick} />
        );
    }
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        autoplay: false,
        speed: 3000,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


    return (
        <Slider {...settings}>
            {
                trendingNewsData?.map(post => (
                    <div className="" key={post.id}>
                        <div className="trending-news-item">
                            <div className="trending-news-thumb">
                                <Image
                                    className='w-[350px] h-[250px] object-cover'
                                    src={post?.thumbnail_img_medium ? (`/assets/images/${post?.thumbnail_img_medium}`) : "https://placehold.co/350x250.png"}
                                    alt={post?.title}
                                    width={350}
                                    height={250}
                                // blurDataURL="data:..." automatically provided
                                // placeholder="blur" // Optional blur-up while loading
                                />

                                <div className="icon">
                                    <span>
                                        <svg className="m-auto mt-2 h-4 w-4" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 256L28.5 28c2-16 15.6-28 31.8-28H228.9c15 0 27.1 12.1 27.1 27.1c0 3.2-.6 6.5-1.7 9.5L208 160H347.3c20.2 0 36.7 16.4 36.7 36.7c0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7h-2.9c-15.7 0-28.5-12.8-28.5-28.5c0-2.3 .3-4.6 .9-6.9L176 288H32c-17.7 0-32-14.3-32-32z" /></svg>
                                    </span>
                                </div>
                            </div>
                            <div className="trending-news-content mt-4">
                                <div className="post-meta">
                                    <div className="meta-categories">
                                        <Link
                                            href={`/category/${post?.category}`}
                                            className='text-sm'>
                                            {post?.category}
                                        </Link>
                                    </div>
                                    <div className="meta-date">
                                        <span>{formattedDate(post?.published_date)}</span>
                                    </div>
                                </div>
                                <h3 className="title">
                                    <Link href={`/posts/${post?.id}`}>
                                        {post?.title?.slice(0, 50)}...
                                    </Link>
                                </h3>
                                <p className="text">{post?.content.slice(0, 120)}...</p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </Slider>
    )
}