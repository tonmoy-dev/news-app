import { formattedDate } from '@/utils/format-date';
import Image from 'next/image';
import Link from 'next/link';


export default function CategoryNews({ categoryName, categoryNews }) {

    return (
        <>
            <div className="md:col-span-8 p-5 bg-white">
                <div className="about-tab-btn relative h-full">
                    <div className="archive-btn">
                        <h2 className="text-2xl font-medium mb-6">Category: <span>{categoryName}</span>
                        </h2>
                    </div>
                    <div className="about-post-items">
                        <div className="flex flex-col">
                            <div className="w-full mb-10">
                                {
                                    categoryNews?.map(post => (
                                        <div className="business-post-item mb-10" key={post?.id}>
                                            <div className="flex flex-col md:flex-row gap-5">
                                                <div className="md:w-1/2">
                                                    <div className="business-post-thumb">

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
                                                </div>
                                                <div className="md:w-1/2">
                                                    <div className="trending-news-item">
                                                        <div className="trending-news-content">
                                                            <div className="post-meta">
                                                                <div className="meta-categories">
                                                                    <a href="#">{post?.category}</a>
                                                                </div>
                                                                <div className="meta-date">
                                                                    <span>{formattedDate(post?.published_date)}</span>
                                                                </div>
                                                            </div>
                                                            <h3 className="title">
                                                                <Link href={`/posts/${post?.id}`}>
                                                                    {post?.title}
                                                                </Link>
                                                            </h3>
                                                            <p className="text">
                                                                {post?.content}
                                                            </p>
                                                            <Link href={`/posts/${post?.id}`}>
                                                                Read more
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            {/* pagination */}
                            <div className='mt-10 md:mt-0 md:absolute md:bottom-0 w-full'>
                                <div className="flex items-center justify-between border-t border-gray-200 py-3 ">
                                    <div>
                                        <p className="text-base text-gray-700">
                                            Showing
                                            {/* <span className="font-medium">1</span> to  */} {" "}
                                            <span className="font-medium">{categoryNews?.length}</span> of{' '}
                                            <span className="font-medium">{categoryNews?.length}</span> results
                                        </p>
                                    </div>
                                </div>
                                {
                                    categoryNews?.length > 10 && (
                                        <div className="w-full">
                                            <div className="pagination-item">
                                                <nav aria-label="Page navigation example">
                                                    <ul className="pagination flex">
                                                        <li className="page-item active">
                                                            <a className="page-link" href="#">
                                                                01
                                                            </a>
                                                        </li>
                                                        <li className="page-item">
                                                            <a className="page-link" href="#">
                                                                02
                                                            </a>
                                                        </li>
                                                        <li className="page-item dot-item">
                                                            <span>
                                                                ...
                                                            </span>
                                                        </li>
                                                        <li className="page-item">
                                                            <a className="page-link" href="#">
                                                                50
                                                            </a>
                                                        </li>
                                                        {/* <li className="page-item">
                                                            <a className="page-link" href="#" aria-label="Next">
                                                                <span aria-hidden="true">
                                                                    <i className="fas fa-caret-right" />
                                                                </span>
                                                            </a>
                                                        </li> */}
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
