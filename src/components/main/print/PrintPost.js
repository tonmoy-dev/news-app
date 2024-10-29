"use client"
import { useRef } from 'react';
import { toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { formattedDate } from '@/utils/format-date';

const html2pdf = dynamic(() => import('html2pdf.js'), { ssr: false });

const today = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };


export default function PrintPost({ post }) {
    const pageRef = useRef(null);
    const htmlString = post?.description;

    // get today's date
    const formattedTodaysDate = today.toLocaleDateString('en-US', options);

    // pdf download handler
    const handleDownloadAsPDF = async () => {
        if (pageRef.current === null) {
            return;
        }
        const html2pdfLib = (await import('html2pdf.js')).default;
        const element = pageRef.current;

        // Define options for html2pdf
        const options = {
            margin: 0.5,
            filename: 'page-content.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
        };

        // Generate and download PDF
        html2pdfLib().from(element).set(options).save();
    };

    // image download handler
    const handleDownloadAsJpg = async () => {
        if (pageRef.current === null) {
            return;
        }

        try {
            const dataUrl = await toJpeg(pageRef.current,
                {
                    quality: 0.95,
                    style: {
                    },
                });
            saveAs(dataUrl, 'page-screenshot.jpg'); // Save the image as a .jpg file
        } catch (err) {
            console.error('Failed to download image', err);
        }
    };

    return (
        <>
            <div className="main-container pt-8 pb-6">
                <div className='w-[800px] mx-auto '>
                    <div
                        ref={pageRef}
                        className='border border-1 border-black'
                        id="page-content"
                        style={{
                            // backgroundColor: 'white',
                            textAlign: 'left',
                            boxSizing: 'border-box',
                            backgroundColor: 'white', // Ensure white background for screenshot
                            padding: '10px 20px', // Padding inside the screenshot
                            display: 'flex', // Use flexbox for centering
                            justifyContent: 'center', // Center content horizontally
                            alignItems: 'center', // Center content vertically
                            width: '100%',
                            minHeight: '100vh', // Full height to ensure vertical centering
                            boxSizing: 'border-box', // Ensure padding is included within the width/height
                        }}
                    >
                        <div className='p-6 flex justify-center items-center flex-col text-black'>

                            <div>
                                <Image
                                    className='w-[350px] h-auto'
                                    src={"https://placehold.co/350x50.png"}
                                    alt="logo"
                                    width={350}
                                    height={50}
                                // blurDataURL="data:..."
                                // placeholder="blur" // Optional blur-up while loading
                                />
                            </div>
                            <div className='py-2 my-4 font-medium text-sm'>
                                <span>
                                    Print Date: {formattedTodaysDate}
                                </span>
                                {" "} || {" "}
                                <span>
                                    News Published Date: {formattedDate(post?.published_date)}
                                </span>
                            </div>
                            <div>
                                <div className="post-content">
                                    <h2 className="title text-center text-2xl font-medium mb-4">
                                        {post?.title}
                                    </h2>
                                    <div className="thumb relative">
                                        <Image
                                            className='w-[730px] h-[450px] object-cover mx-auto'
                                            src={post?.thumbnail_image ? `/assets/images/${post?.thumbnail_image}` : "https://placehold.co/730x450.png"}
                                            alt={post?.title}
                                            style={{ objectFit: "cover" }}
                                            width={730}
                                            height={450}
                                        // blurDataURL="data:..."
                                        // placeholder="blur" // Optional blur-up while loading
                                        />
                                    </div>
                                </div>
                                <div className="post-author">
                                    <div className="author-info">
                                        <div className="thumb">
                                            <Image
                                                className='w-[45px] h-[43px]'
                                                src={"https://placehold.co/45x43.png"}
                                                alt={post?.reporter}
                                                width={45}
                                                height={43}
                                            // blurDataURL="data:..."
                                            // placeholder="blur" // Optional blur-up while loading
                                            />
                                        </div>
                                        <h5 className="title">{post?.reporter}</h5>
                                        <ul>
                                            <li>{formattedDate(post?.published_date)}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className='mt-5 mb-10'>
                                    <div dangerouslySetInnerHTML={{ __html: htmlString }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center text-white gap-6'>
                <button className='px-4 py-2 bg-green-500' onClick={handleDownloadAsPDF}>Print Page</button>
                <button className='px-2 py-2 bg-red-500' onClick={handleDownloadAsJpg}>Download as JPG</button>
            </div>
        </>
    )
}