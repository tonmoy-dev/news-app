"use client"

import { formattedDate } from '@/utils/format-date';
import { FaAngleLeft } from '@react-icons/all-files/fa/FaAngleLeft';
import { FaAngleRight } from '@react-icons/all-files/fa/FaAngleRight';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';

export default function FeaturedNewsSlider({ news }) {
    const featuredNewsData = news?.filter(post => post.featured_news);

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
        slidesToShow: 4,
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
                featuredNewsData?.map(post => (
                    <div className="" key={post?.id}>
                        <div className="feature-post">
                            <div className="feature-post-thumb">
                                <Image
                                    className='w-[250px] h-[310px] object-cover'
                                    src={post?.thumbnail_img_medium ? (`/assets/images/${post?.thumbnail_img_medium}`) : "https://placehold.co/250x310.png"}
                                    alt={post?.title}
                                    width={250}
                                    height={310}
                                // blurDataURL="data:..." automatically provided
                                // placeholder="blur" // Optional blur-up while loading
                                />
                            </div>
                            <div className="feature-post-content pb-3 pe-2">
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
                                <h4 className="title">
                                    <Link href={`/posts/${post?.id}`}>
                                        {post?.title.slice(0, 45)}...
                                    </Link>
                                </h4>
                            </div>
                        </div>
                    </div>
                ))
            }
        </Slider>
    )
}