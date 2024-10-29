// server component
import { authConfig } from '@/utils/auth.config';
import { formattedDate } from '@/utils/format-date';
import { apiRequestHandler } from '@/utils/requestHandlers';
import { FaEye } from "@react-icons/all-files/fa/FaEye";
import { FaHeart } from "@react-icons/all-files/fa/FaHeart";
import { FaTag } from "@react-icons/all-files/fa/FaTag";
import NextAuth from "next-auth";
import Image from 'next/image';
import { Toaster } from "react-hot-toast";
import NewsTabSidebar from '../shared/NewsTabSidebar';
import TrendingNewsSidebar from "../shared/TrendingNewsSidebar";
import PostSocials from "./PostSocials";

const { auth } = NextAuth(authConfig);

// Generate a random number between 100 and 1000
function getRandomNumber() {
  return Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
}
const randomNumber = getRandomNumber();

export default async function PostLayout({ post }) {
  const session = await auth();

  const htmlString = post?.description;
  const tags = post?.tags?.split(",");

  const approvedNews = await apiRequestHandler('/news', {
    filter: [
      { status: 'Approved' },
    ],
    sort: [
      { published_date: 'desc' }
    ]
  });

  const popularNews = approvedNews?.sort((a, b) => b.total_views - a.total_views);
  const trendingNews = approvedNews?.filter(post => post.trending_news === 1);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      {/*====== POST LAYOUT ======*/}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-10">
        <div className="md:col-span-8">
          {/*====== Single Post Content ======*/}
          <div className="post-layout-top-content p-5 bg-white h-full relative">
            <article>
              <div className="post-categories flex justify-between items-center">
                <div className="categories-item">
                  <span>{post?.category}</span>
                </div>
                <div className="categories-share">
                  <ul>
                    <li>
                      <FaHeart className="me-1 inline-block w-4 h-4" />
                      {post?.total_impressions}
                    </li>
                    <li>
                      <FaEye className="me-1 inline-block" />
                      {/* {post?.total_views} */}
                      {randomNumber}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="post-content">
                <h3 className="title">
                  {post?.title}
                </h3>
                <p style={{ paddingTop: "15px" }}>
                  {post?.sub_title}
                </p>
                <div className="thumb relative">
                  <Image
                    className='max-w-[730px] max-h-[450px] object-contain md:object-cover'
                    src={post?.thumbnail_img_original ? `/assets/images/${post?.thumbnail_img_original}` : "https://placehold.co/730x450.png"}
                    alt={post?.title}
                    width={730}
                    height={450}
                  // blurDataURL="data:..."
                  // placeholder="blur" // Optional blur-up while loading
                  />
                  {/* watermark image */}
                  {/* <div className='absolute bottom-4 right-4' >
                    <Image
                      className='w-[250px] h-[50px] border-2 border-white'
                      src={"https://placehold.co/250x50.png"}
                      alt="logo"
                      width={250}
                      height={50}
                    // blurDataURL="data:..."
                    // placeholder="blur" // Optional blur-up while loading
                    />
                  </div> */}
                </div>
              </div>
              <div className="post-author">
                <div className="author-info">
                  <div className="thumb">
                    <Image
                      className='w-[45px] h-[43px] rounded-full'
                      src={"https://placehold.co/45x43.png"}
                      alt={post?.reporter}
                      width={45}
                      height={43}
                    // blurDataURL="data:..."
                    // placeholder="blur" // Optional blur-up while loading
                    />
                  </div>
                  <h5 className="title">
                    {post?.reporter}
                  </h5>
                  <ul>
                    <li>{formattedDate(post?.published_date)}</li>
                  </ul>
                </div>
                <div className="author-social">
                  <PostSocials postCategory={post?.category} user={session?.user} postId={post?.id} postTitle={post?.title} />
                </div>
              </div>
              <div className='mt-5 mb-20'>
                <div dangerouslySetInnerHTML={{ __html: htmlString }} />
              </div>
              <div className="post-tags mt-10 md:mt-0 md:absolute md:bottom-5 w-[95%] overflow-hidden">
                <ul className='flex gap-2 flex-wrap items-center justify-start'>
                  <li>
                    <span>
                      <FaTag className="me-1 inline-block" />
                      Tags
                    </span>
                  </li>
                  {
                    tags.map(tag =>
                    (
                      <li key={tag}>
                        <span>{tag}</span>
                      </li>
                    )
                    )
                  }

                </ul>
              </div>
            </article>
          </div>
        </div>
        <div className="md:col-span-4">
          <div className="post_gallery_sidebar space-y-4">
            <NewsTabSidebar latestNews={approvedNews} popularNews={popularNews} />
            {/* <TrendingSocials /> */}
            <TrendingNewsSidebar news={trendingNews} />
            {/* <NewsletterBox /> */}
          </div>
        </div>
      </div>
    </>

  )
}