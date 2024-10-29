import CategoryNews from "@/components/main/news/CategoryNews";
import Breadcrumb from "@/components/main/shared/Breadcrumb";
import NewsTabSidebar from "@/components/main/shared/NewsTabSidebar";
import TrendingNewsSidebar from "@/components/main/shared/TrendingNewsSidebar";
import fetchData from "@/utils/fetchData";
import { apiRequestHandler } from "@/utils/requestHandlers";

// export const revalidate = 10;   // revalidate in 10 seconds
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { name } = params;
    const pageData = await fetchData(`/api/site-settings/meta-info?page=Home`);
    const categoryData = await fetchData(`/api/categories?name=${name}`);

    const metaData = pageData?.[0];
    const categoryInfo = categoryData?.[0]

    if (!metaData || !categoryData) {
        return;
    }

    return {
        title: categoryInfo?.meta_title,
        description: categoryInfo?.meta_description,
        applicationName: categoryInfo?.meta_title,
        authors: { name: metaData?.meta_author },
        keywords: categoryInfo?.meta_keywords?.split(','),
        openGraph: {
            title: categoryInfo?.meta_title,
            description: categoryInfo?.meta_description,
            url: metaData?.og_url,
            siteName: metaData?.og_site_name,
            type: metaData?.og_type,
            locale: metaData?.og_locale,
            images: {
                url: metaData?.og_image_url,
                alt: metaData?.og_image_alt,
            },
        },
        twitter: {
            card: metaData?.twitter_card,
            title: categoryInfo?.meta_title,
            description: categoryInfo?.meta_description,
            site: metaData?.twitter_site,
            images: {
                url: metaData?.twitter_img_url,
                alt: metaData?.twitter_img_alt,
            }, // Must be an absolute URL
        },
        alternates: {
            canonical: metaData?.canonical_url,
        },

        icons: {
            icon: metaData?.icon_url ?? '/assets/favicon.ico',
            shortcut: metaData?.shortcut_icon_url ?? '/assets/favicon.ico',
            apple: metaData?.apple_icon_url ?? '/assets/favicon.ico',
        },
    };
}

export default async function CategoryPage({ params }) {
    const { name } = params;

    const categoryNews = await apiRequestHandler('/news', {
        filter: [
            { category: name },
            { status: 'Approved' },
        ],
        sort: [
            { published_date: 'desc' }
        ]
    });

    const approvedNews = await apiRequestHandler('/news', {
        filter: [
            { status: 'Approved' }
        ],
        sort: [
            { published_date: 'desc' }
        ]
    });

    const popularNews = approvedNews?.sort((a, b) => b.total_views - a.total_views);
    const trendingNews = approvedNews?.filter(post => post.trending_news === 1);

    const pageData = await fetchData(`/api/site-settings/meta-info?page=Home`);
    const metaData = pageData?.[0];

    let jsonLd;
    if (metaData) {
        jsonLd = {
            '@context': 'https://schema.org',
            '@type': metaData?.json_ld_type,
            headline: metaData?.json_ld_headline,
            image: [metaData?.json_ld_image_url],
            datePublished: metaData?.json_ld_date_published,
            dateModified: metaData?.json_ld_date_modified,
            author: [
                {
                    "@type": metaData?.json_ld_author_type,
                    name: metaData?.json_ld_author_name
                },
            ],
            publisher: {
                "@type": metaData?.json_ld_publisher_type,
                name: metaData?.json_ld_publisher_name,
                logo: {
                    "@type": "ImageObject",
                    url: metaData?.json_ld_logo_img_url
                }
            },
            description: metaData?.json_ld_description,
        }
    }

    if (!categoryNews || categoryNews.length === 0) {
        throw new Error('No data found');
    }

    // if (!latestNews || !popularNews || !trendingNews || !categoryNews) return <div>Loading...</div>;

    return (
        <>
            {/* Add JSON-LD to your page */}
            {
                metaData && (
                    < script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }
                        }
                    />
                )
            }
            <section className="about-item-area">
                <div className="main-container">
                    <Breadcrumb page1={"Categories"} pageLink1={"/news-categories"} page2={name} pageLink2={`/category/${name}`} />
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-10 mx-4 md:mx-0">
                        <CategoryNews categoryNews={categoryNews} categoryName={name} />
                        {/* Side Bar */}
                        <div className="md:col-span-4 space-y-4">
                            <div className="post_gallery_sidebar space-y-4">
                                <NewsTabSidebar latestNews={approvedNews} popularNews={popularNews} />
                                {/* <NewsletterBox /> */}
                                <TrendingNewsSidebar news={trendingNews} />
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </>
    )
} 