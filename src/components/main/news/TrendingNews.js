
import { formattedDate } from "@/utils/format-date";
import Image from "next/image";
import Link from "next/link";
import MostViewsNewsSidebar from "../shared/MostViewsNewsSidebar";
import TrendingSocials from "../shared/TrendingSocials";
import TrendingNewsSlider from "./TrendingNewsSlider";


export default function TrendingNews({ news }) {
    const trendingNewsData = news.filter(post => post.trending_news);


    return (
        <>
            {/* <!--====== TRENDING NEWS PART START ======--> */}

            <section className="trending-news-area my-4">
                <div className="container px-4 lg:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-8 p-5 bg-white">
                            <div className="section-title">
                                <h3 className="title">Trending News</h3>
                            </div>
                            <div className="trending-news-slider" style={{ paddingBottom: '25px' }}>
                                <TrendingNewsSlider trendingNewsData={trendingNewsData} />
                            </div>
                            <div className="row grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="trending-news-post-items">
                                    {
                                        trendingNewsData?.slice(0, 4)?.map(post => (
                                            <div className="gallery_item" key={post.id}>
                                                <div className="gallery_item_thumb">

                                                    <Image
                                                        className='w-[100px] h-[77px] object-cover'
                                                        src={post?.thumbnail_img_small ? (`/assets/images/${post?.thumbnail_img_small}`) : "https://placehold.co/100x77.png"}
                                                        alt={post?.title}
                                                        width={100}
                                                        height={77}
                                                    // blurDataURL="data:..." automatically provided
                                                    // placeholder="blur" // Optional blur-up while loading
                                                    />
                                                    <div className="icon p-1 bg-[#FF5555] text-white rounded-full">
                                                        <svg className="w-3 h-3" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 256L28.5 28c2-16 15.6-28 31.8-28H228.9c15 0 27.1 12.1 27.1 27.1c0 3.2-.6 6.5-1.7 9.5L208 160H347.3c20.2 0 36.7 16.4 36.7 36.7c0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7h-2.9c-15.7 0-28.5-12.8-28.5-28.5c0-2.3 .3-4.6 .9-6.9L176 288H32c-17.7 0-32-14.3-32-32z" /></svg>
                                                    </div>
                                                </div>
                                                <div className="gallery_item_content">
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
                                                    <h4 className="title">
                                                        <Link href={`/posts/${post?.id}`}>
                                                            {post?.title.slice(0, 50)}...
                                                        </Link>
                                                    </h4>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="trending-news-post-items">
                                    {
                                        trendingNewsData?.slice(-4)?.map(post => (
                                            <div className="gallery_item" key={post.id}>
                                                <div className="gallery_item_thumb">
                                                    <Image
                                                        className='w-[100px] h-[77px] object-cover'
                                                        src={post?.thumbnail_img_small ? (`/assets/images/${post?.thumbnail_img_small}`) : "https://placehold.co/100x77.png"}
                                                        alt={post?.title}
                                                        width={100}
                                                        height={77}
                                                    // blurDataURL="data:..." automatically provided
                                                    // placeholder="blur" // Optional blur-up while loading
                                                    />
                                                    <div className="icon p-1 bg-[#FF5555] text-white rounded-full">
                                                        <svg className="w-3 h-3" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 256L28.5 28c2-16 15.6-28 31.8-28H228.9c15 0 27.1 12.1 27.1 27.1c0 3.2-.6 6.5-1.7 9.5L208 160H347.3c20.2 0 36.7 16.4 36.7 36.7c0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7h-2.9c-15.7 0-28.5-12.8-28.5-28.5c0-2.3 .3-4.6 .9-6.9L176 288H32c-17.7 0-32-14.3-32-32z" /></svg>
                                                    </div>
                                                </div>
                                                <div className="gallery_item_content">
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
                                                    <h4 className="title">
                                                        <Link href={`/posts/${post?.id}`}>
                                                            {post?.title?.slice(0, 50)}...
                                                        </Link>
                                                    </h4>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-4 ms-0 space-y-4">
                            <TrendingSocials />
                            <MostViewsNewsSidebar news={news} />
                        </div>
                    </div>
                </div>
            </section>

            {/* <!--====== TRENDING NEWS PART ENDS ======--> */}
        </>
    )
}
