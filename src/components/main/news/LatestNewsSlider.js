"use client"

import { FaAngleLeft } from '@react-icons/all-files/fa/FaAngleLeft';
import { FaAngleRight } from '@react-icons/all-files/fa/FaAngleRight';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';

export default function LatestNewsSlider({ news }) {

    // slider configs
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <FaAngleRight className={className}
                style={{ ...style, display: "block", padding: "10px" }}
                onClick={onClick} />
        );
    }
    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <FaAngleLeft className={className}
                style={{ ...style, display: "block", padding: "10px" }}
                onClick={onClick} />
        );
    }
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        autoplay: false,
        speed: 3000,
        autoplaySpeed: 3000,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                }
            }
        ]
    };

    return (
        <Slider {...settings} className="text-sm">
            {
                news?.map(post => (
                    <div key={post?.id}>
                        <div className="single__post">
                            <div className="post-thumb">
                                <Image
                                    className='w-[120px] h-[80px] object-contain'
                                    src={post?.thumbnail_img_medium ? (`/assets/images/${post?.thumbnail_img_medium}`) : "https://placehold.co/120x80.png"}
                                    alt={post?.title}
                                    width={100}
                                    height={80}
                                // blurDataURL="data:..." automatically provided
                                // placeholder="blur" // Optional blur-up while loading
                                />
                            </div>
                            <div className="post-content">
                                <h4 className="title">
                                    <Link href={`/posts/${post?.id}`}>
                                        {post?.title?.slice(0, 45)}...
                                    </Link>
                                </h4>
                                <p>{post?.sub_title?.slice(0, 30)}...</p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </Slider>
    )
}