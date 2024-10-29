"use client"

import { FaAngleLeft } from '@react-icons/all-files/fa/FaAngleLeft';
import { FaAngleRight } from '@react-icons/all-files/fa/FaAngleRight';
import { FaFacebookF } from "@react-icons/all-files/fa/FaFacebookF";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import Slider from 'react-slick';

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


export default function MostShareNewsSidebar() {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        autoplay: false,
        speed: 2000,
        autoplaySpeed: 3000,
    };


    return (
        <>
            <div className="most-share-post">
                <div className="section-title">
                    <h3 className="title">Most Share</h3>
                </div>
            </div>
            <div className="trending-sidebar-slider">
                <div className="most-share-post-items">
                    <Slider {...settings}>
                        <div>
                            {
                                mostSharePostItems.map(item => (
                                    <div className="most-share-post-item" key={item.id}>
                                        <div className="post-meta">
                                            <div className="meta-categories">
                                                <a href="#">{item.category}</a>
                                            </div>
                                            <div className="meta-date">
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                        <h3 className="title"><a href="#">{item.title}</a></h3>
                                        <ul>
                                            <li>
                                                <FaTwitter />
                                                <span className="ms-2">{item.shares.twitter}</span>
                                            </li>
                                            <li>
                                                <FaFacebookF />
                                                <span className="ms-2">{item.shares.facebook} </span>
                                            </li>
                                        </ul>
                                        <div className="count">
                                            <span>{item.rank}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div>
                            {
                                mostSharePostItems.map(item => (
                                    <div className="most-share-post-item" key={item.id}>
                                        <div className="post-meta">
                                            <div className="meta-categories">
                                                <a href="#">{item.category}</a>
                                            </div>
                                            <div className="meta-date">
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                        <h3 className="title"><a href="#">{item.title}</a></h3>
                                        <ul>
                                            <li>
                                                <FaTwitter />
                                                <span className="ms-2">{item.shares.twitter}</span>
                                            </li>
                                            <li>
                                                <FaFacebookF />
                                                <span className="ms-2">{item.shares.facebook} </span>
                                            </li>
                                        </ul>
                                        <div className="count">
                                            <span>{item.rank}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </Slider>
                </div>
                {/* <div className="most-share-post-items">
                                        <div className="most-share-post-item">
                                            <div className="post-meta">
                                                <div className="meta-categories">
                                                    <a href="#">TECHNOLOGY</a>
                                                </div>
                                                <div className="meta-date">
                                                    <span>March 26, 2020</span>
                                                </div>
                                            </div>
                                            <h3 className="title"><a href="#">Nancy zhang a chinese busy woman and dhaka</a></h3>
                                            <ul>
                                                <li><i className="fab fa-twitter"></i> 2.2K</li>
                                                <li><i className="fab fa-facebook-f"></i> 3.5K</li>
                                            </ul>
                                            <div className="count">
                                                <span>1</span>
                                            </div>
                                        </div>
                                        <div className="most-share-post-item">
                                            <div className="post-meta">
                                                <div className="meta-categories">
                                                    <a href="#">TECHNOLOGY</a>
                                                </div>
                                                <div className="meta-date">
                                                    <span>March 26, 2020</span>
                                                </div>
                                            </div>
                                            <h3 className="title"><a href="#">Nancy zhang a chinese busy woman and dhaka</a></h3>
                                            <ul>
                                                <li><i className="fab fa-twitter"></i> 2.2K</li>
                                                <li><i className="fab fa-facebook-f"></i> 3.5K</li>
                                            </ul>
                                            <div className="count">
                                                <span>2</span>
                                            </div>
                                        </div>
                                        <div className="most-share-post-item">
                                            <div className="post-meta">
                                                <div className="meta-categories">
                                                    <a href="#">TECHNOLOGY</a>
                                                </div>
                                                <div className="meta-date">
                                                    <span>March 26, 2020</span>
                                                </div>
                                            </div>
                                            <h3 className="title"><a href="#">Nancy zhang a chinese busy woman and dhaka</a></h3>
                                            <ul>
                                                <li><i className="fab fa-twitter"></i> 2.2K</li>
                                                <li><i className="fab fa-facebook-f"></i> 3.5K</li>
                                            </ul>
                                            <div className="count">
                                                <span>3</span>
                                            </div>
                                        </div>
                                        <div className="most-share-post-item">
                                            <div className="post-meta">
                                                <div className="meta-categories">
                                                    <a href="#">TECHNOLOGY</a>
                                                </div>
                                                <div className="meta-date">
                                                    <span>March 26, 2020</span>
                                                </div>
                                            </div>
                                            <h3 className="title"><a href="#">Nancy zhang a chinese busy woman and dhaka</a></h3>
                                            <ul>
                                                <li><i className="fab fa-twitter"></i> 2.2K</li>
                                                <li><i className="fab fa-facebook-f"></i> 3.5K</li>
                                            </ul>
                                            <div className="count">
                                                <span>4</span>
                                            </div>
                                        </div>
                                        <div className="most-share-post-item">
                                            <div className="post-meta">
                                                <div className="meta-categories">
                                                    <a href="#">TECHNOLOGY</a>
                                                </div>
                                                <div className="meta-date">
                                                    <span>March 26, 2020</span>
                                                </div>
                                            </div>
                                            <h3 className="title"><a href="#">Nancy zhang a chinese busy woman and dhaka</a></h3>
                                            <ul>
                                                <li><i className="fab fa-twitter"></i> 2.2K</li>
                                                <li><i className="fab fa-facebook-f"></i> 3.5K</li>
                                            </ul>
                                            <div className="count">
                                                <span>5</span>
                                            </div>
                                        </div>
                                    </div> */}
            </div>
        </>
    )
}


const mostSharePostItems = [
    {
        id: 1,
        category: "TECHNOLOGY",
        date: "March 26, 2020",
        title: "Nancy zhang a chinese busy woman and dhaka",
        shares: {
            twitter: "2.2K",
            facebook: "3.5K"
        },
        rank: 1
    },
    {
        id: 2,
        category: "TECHNOLOGY",
        date: "March 26, 2020",
        title: "Nancy zhang a chinese busy woman and dhaka",
        shares: {
            twitter: "2.2K",
            facebook: "3.5K"
        },
        rank: 2
    },
    {
        id: 3,
        category: "TECHNOLOGY",
        date: "March 26, 2020",
        title: "Nancy zhang a chinese busy woman and dhaka",
        shares: {
            twitter: "2.2K",
            facebook: "3.5K"
        },
        rank: 3
    },
    {
        id: 4,
        category: "TECHNOLOGY",
        date: "March 26, 2020",
        title: "Nancy zhang a chinese busy woman and dhaka",
        shares: {
            twitter: "2.2K",
            facebook: "3.5K"
        },
        rank: 4
    },
    {
        id: 5,
        category: "TECHNOLOGY",
        date: "March 26, 2020",
        title: "Nancy zhang a chinese busy woman and dhaka",
        shares: {
            twitter: "2.2K",
            facebook: "3.5K"
        },
        rank: 5
    }
];
