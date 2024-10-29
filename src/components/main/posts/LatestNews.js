import { formattedDate } from "@/utils/format-date";
import Image from "next/image";
import Link from "next/link";

export default function LatestNews({ news }) {


    return (
        <>
            {/*====== LATEST NEWS PART START ======*/}
            <section className="latest-news-area">
                <div className="main-container ">
                    <div className="mx-4 md:mx-0">
                        <div className="section-title">
                            <h3 className="title">Our latest news</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mx-4 md:mx-0">
                        {
                            news?.slice(0, 3)?.map(post => (
                                <div className="trending-news-item shadow bg-white" key={post?.id}>
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
                                    </div>
                                    <div className="trending-news-content p-4">
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
                                        <h3 className="title">
                                            <Link href={`/posts/${post?.id}`}>
                                                {post?.title.slice(0, 60)}...
                                            </Link>
                                        </h3>
                                        <p className="text">
                                            {post?.content.slice(0, 160)}...
                                        </p>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>
            </section>
            {/*====== LATEST NEWS PART ENDS ======*/}
        </>

    )
}