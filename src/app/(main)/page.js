import FeaturedNews from "@/components/main/news/FeaturedNews";
import LatestNews from "@/components/main/news/LatestNews";
import NewsGallery from "@/components/main/news/NewsGallery";
import TrendingNews from "@/components/main/news/TrendingNews";
import { dataFetcher } from "@/utils/fetcher/dataFetcher";
import { apiRequestHandler } from "@/utils/requestHandlers";

export const dynamic = 'force-dynamic';
// export const revalidate = 10;   // revalidate in 10 seconds

export async function generateMetadata() {
  const pagesData = await dataFetcher('/site-settings/meta-info', { page: "Home" });
  const metaData = pagesData?.[0];

  if (metaData === null || metaData === undefined || !metaData) {
    throw new Error('No data found');
  }

  return {
    title: metaData?.title,
    description: metaData?.meta_description,
    applicationName: metaData?.application_name,
    authors: { name: metaData?.meta_author },
    keywords: metaData?.meta_keywords?.split(','),
    openGraph: {
      title: metaData?.og_title,
      description: metaData?.og_description,
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
      title: metaData?.twitter_title,
      description: metaData?.twitter_description,
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

export default async function HomePage() {
  const approvedNews = await apiRequestHandler('/news', {
    filter: [
      { status: 'Approved' }
    ],
    sort: [
      { published_date: 'desc' }
    ]
  });
  const featuredNews = approvedNews?.filter(post => post.featured_news === 1);
  const trendingNews = approvedNews?.filter(post => post.trending_news === 1);
  const pagesData = await dataFetcher('/site-settings/meta-info', { page: "Home" });
  const metaData = pagesData?.[0];

  if (!approvedNews || approvedNews.length === 0 || metaData === null) {
    throw new Error('No data found');
  }

  const jsonLd = {
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

  return (

    <>
      {/* Add JSON-LD to your page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="main-container">
        {/* <!--====== LATEST NEWS ======--> */}
        <LatestNews news={approvedNews} />

        {/* <!--====== NEWS GALLERY ======--> */}
        <NewsGallery news={approvedNews} />

        {/* <!--====== FEATURED NEWS ======--> */}
        <FeaturedNews news={featuredNews} />

        {/* <!--====== TRENDING NEWS ======--> */}
        <TrendingNews news={trendingNews} />
      </main>
    </>
  );
}
