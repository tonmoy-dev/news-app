
import { apiRequestHandler } from "@/utils/requestHandlers";
import NewsTabSidebar from "../shared/NewsTabSidebar";
import NewsGallerySlider from "./NewsGallerySlider";


export default async function NewsGallery({ news }) {
    const popularNews = await apiRequestHandler('/news', {
        filter: [
            { status: 'Approved' },
        ],
        sort: [
            { total_views: 'desc' }
        ]
    });

    if (!news || !popularNews) return <div>Loading...</div>;

    return (
        <>
            {/* <!--====== POST GALLERY PART START ======--> */}
            <div className="post__gallery__area">
                <div className="px-4 lg:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-8 p-5 bg-white">
                            <div className="post_gallery_slider">
                                <div className="slider-container post-gallery-slider post_gallery_inner_slider">
                                    <NewsGallerySlider news={news} />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <div className="h-full">
                                <NewsTabSidebar latestNews={news} popularNews={popularNews} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--====== POST GALLERY PART ENDS ======--> */}
        </>
    )
}