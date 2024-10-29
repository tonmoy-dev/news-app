import NewsColumn from "@/components/main/news/NewsColumn";
import fetchData from "@/utils/fetchData";
import { dataFetcher } from "@/utils/fetcher/dataFetcher";
import { apiRequestHandler } from "@/utils/requestHandlers";
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
// export const revalidate = 10;   // revalidate in 10 seconds

export async function generateMetadata() {
  const pagesData = await dataFetcher('/site-settings/meta-info', { page: "Home" });
  const metaData = pagesData?.[0];

  if (metaData === null || metaData === undefined || !metaData) {
    throw new Error('No data found');
  }

  return {
    title: 'News Categories',
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

export default async function CategoriesPage() {
  const categories = await dataFetcher('/categories', { status: 1 });
  const approvedNews = await apiRequestHandler('/news', {
    filter: [
      { status: 'Approved' }
    ],
    sort: [
      { published_date: 'desc' }
    ],
    limit: 30
  });

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

  const categoriesNames = categories?.map(item => item.name);

  if (!approvedNews || approvedNews.length === 0) {
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
      <section>
        <div className="main-container">
          {/*====== Breadcrumb ======*/}
          <div className="mx-4 md:mx-0">
            <nav className="flex mt-4 text-sm" aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-2">
                <li>
                  <div>
                    <Link href="/" className="text-gray-400 hover:text-gray-500">
                      <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <span className="sr-only">Home</span>
                    </Link>
                  </div>
                </li>
                <div className="flex items-center">
                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <Link href="/news-categories"
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Categories
                  </Link>
                </div>
              </ol>
            </nav>
          </div>
          {/* News Columns by category */}
          <div className="mx-4 md:mx-0 grid grid-cols-1 md:grid-cols-3 my-5 gap-4 mt-10">
            {
              categoriesNames.map(name => (
                <NewsColumn key={name} category={name} newsData={approvedNews} />
              ))
            }
          </div>
        </div>
      </section >
    </>
  )
} 