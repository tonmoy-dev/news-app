import LatestNews from "@/components/main/posts/LatestNews";
import PostCommentsLayout from "@/components/main/posts/PostCommentsLayout";
import PostLayout from "@/components/main/posts/PostLayout";
import Breadcrumb from "@/components/main/shared/Breadcrumb";
import fetchData from "@/utils/fetchData";
import { apiRequestHandler } from "@/utils/requestHandlers";

export const dynamic = 'force-dynamic';
// export const revalidate = 10;   // revalidate in 10 seconds

export async function generateMetadata({ params }) {
    const { id } = params;
    const pageData = await fetchData(`/api/site-settings/meta-info?page=Home`);
    const newsResponse = await fetch(`${process.env.AUTH_URL}/api/news/${id}`, {
        next: {
            // revalidate: 10
        },
        cache: 'no-store'
    });
    const newsData = await newsResponse.json();
    const metaData = pageData?.[0];

    if (!metaData || !newsData) {
        return;
    }

    return {
        title: newsData?.title,
        description: newsData?.content,
        applicationName: metaData?.title,
        authors: { name: metaData?.meta_author },
        keywords: metaData?.meta_keywords?.split(','),
        openGraph: {
            title: newsData?.title,
            description: newsData?.content,
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
            title: newsData?.title,
            description: newsData?.content,
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

export default async function PostDetailsPage({ params }) {
    const { id } = params;

    // fetch single post data
    const newsById = await apiRequestHandler(`/news`, { id: id });
    const singleNewsData = newsById?.[0];

    const latestNews = await apiRequestHandler('/news', {
        filter: [
            { status: 'Approved' },
        ],
        sort: [
            { published_date: 'desc' }
        ]
    });

    // fetch comments
    const postComments = await fetchData(`/api/post-comments/${id}`);

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

    if (!singleNewsData) {
        throw new Error('No data found');
    }


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
            <div>
                <div className="main-container">
                    {/*====== POST LAYOUT PART START ======*/}
                    <section className="mt-4 mb-20 mx-4 md:mx-0">
                        <div className="container">
                            <Breadcrumb page1={"News"} pageLink1={"/"} page2={singleNewsData?.category} pageLink2={`/category/${singleNewsData?.category}`} />
                            <PostLayout post={singleNewsData} />
                        </div>
                    </section>
                </div>
                <LatestNews news={latestNews} />
                <PostCommentsLayout postId={id} comments={postComments} />
            </div>
        </>
    )
}