"use client"

import { formattedDate } from '@/utils/format-date'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

const categories = [
    {
        name: 'LATEST',
    },
    {
        name: 'POPULAR',
    },
]

export default function NewsTabSidebar({ latestNews, popularNews }) {

    return (
        <div className="post_gallery_sidebar p-5 bg-white h-full">
            <TabGroup defaultIndex={1}>
                <TabList className="flex gap-4 mb-6">
                    {categories.map(({ name }) => (
                        <Tab key={name} as={Fragment}>
                            {({ hover, selected }) => (
                                <button className={clsx("tab-button shadow-md", selected ? "bg-[#1091FF] text-white" : "bg-white")}>{name}</button>
                            )}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="mt-3">
                    <TabPanel key="LATEST" >
                        <div className="post_gallery_items">
                            {latestNews?.slice(0, 4)?.map((post) => (
                                <div className="gallery_item" key={post?.id}>
                                    <div className="gallery_item_thumb">
                                        <Image
                                            className='w-[100px] h-[75px] object-cover'
                                            src={post?.thumbnail_img_small ? (`/assets/images/${post?.thumbnail_img_small}`) : "https://placehold.co/100x75.png"}
                                            alt={post?.title}
                                            width={100}
                                            height={75}
                                        // blurDataURL="data:..." automatically provided
                                        // placeholder="blur" // Optional blur-up while loading
                                        />
                                    </div>
                                    <div className="gallery_item_content">
                                        <div className="post-meta mb-2">
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
                                            <Link
                                                href={`/posts/${post?.id}`}
                                                className='text-sm'>
                                                {post?.title.slice(0, 45)}...
                                            </Link>
                                        </h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                    <TabPanel key="POPULAR" >
                        <div className="post_gallery_items">
                            {popularNews?.slice(0, 4)?.map((post) => (
                                <div className="gallery_item" key={post?.id}>
                                    <div className="gallery_item_thumb">
                                        <Image
                                            className='w-[100px] h-[75px] object-cover'
                                            src={post?.thumbnail_img_small ? (`/assets/images/${post?.thumbnail_img_small}`) : "https://placehold.co/100x75.png"}
                                            alt={post?.title}
                                            width={100}
                                            height={75}
                                        // blurDataURL="data:..." automatically provided
                                        // placeholder="blur" // Optional blur-up while loading
                                        />

                                    </div>
                                    <div className="gallery_item_content">
                                        <div className="post-meta mb-2">
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
                                            <Link
                                                href={`/posts/${post?.id}`}
                                                className='text-sm'>
                                                {post?.title.slice(0, 45)}...
                                            </Link>
                                        </h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabPanel>

                </TabPanels>
            </TabGroup>
        </div>
    )
}



