import fetchData from '@/utils/fetchData';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

export const dynamic = 'force-dynamic';
// export const revalidate = 10;   // revalidate in 10 seconds

const pages = [
    { name: 'Terms & Conditions', href: '#', current: true },
    // { name: 'Distric News', href: '#', current: true },
]

export async function generateMetadata() {
    const pageData = await fetchData(`/api/site-settings/meta-info?page=TermsAndConditions`);
    const metaData = pageData?.[0];

    if (!metaData) {
        return;
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


export default async function TermsConditionsPage() {
    const siteSettings = await fetchData('/api/site-settings');
    const { terms_condition } = siteSettings?.[0];
    const pageData = await fetchData(`/api/site-settings/meta-info?page=TermsAndConditions`);
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
            <div className="main-container">
                <div className="mt-4 mb-6 mx-4 md:mx-0">
                    {/*====== Breadcrumb ======*/}
                    <div className="">
                        <nav className="flex mt-2" aria-label="Breadcrumb">
                            <ol role="list" className="flex items-center space-x-2">
                                <li>
                                    <div>
                                        <a href="#" className="text-gray-400 hover:text-gray-500">
                                            <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                            <span className="sr-only">Home</span>
                                        </a>
                                    </div>
                                </li>
                                {pages.map((page) => (
                                    <li key={page.name}>
                                        <div className="flex items-center">
                                            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            <a
                                                href={page.href}
                                                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                                                aria-current={page.current ? 'page' : undefined}
                                            >
                                                {page.name}
                                            </a>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                    <div className="my-6">
                        <h2 className="text-2xl font-medium">Terms & Conditions</h2>
                    </div>
                </div>
                <div className='space-y-6 px-4 md:px-0'>
                    <div className='font-medium'>
                        <p>Last modified: Octobor, 2024.</p>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: terms_condition }} />
                    <p>
                        Welcome to TrustNews24.com. TrustNews24.com offers website features, news, and other services to you when you visit or access content on TrustNews24.com.
                        By using TrustNews24 services, you agree to these terms and conditions. Please read them carefully.

                        By subscribing to or using any of our services, you agree that you have read, understood, and are bound by these Terms, regardless of how you access or use the services.
                    </p>

                    <div>
                        <h3 className='font-medium text-xl mb-2'>Introduction</h3>
                        <p>
                            The domain name www.TrustNews24.com is owned and operated by TrustNews24, a company incorporated under relevant laws.

                            By accessing this Website, you confirm your understanding of these Terms of Use. If you do not agree to these Terms, you should not use the Website. TrustNews24 reserves the right to change, modify, add, or remove portions of these Terms at any time. Changes will be effective when posted on the Website, with no other notice provided. Please review these Terms of Use regularly for updates. Your continued use of the Website following the posting of changes constitutes your acceptance of those changes.
                        </p>
                    </div>


                    <div>
                        <h3 className='font-medium text-xl mb-2'>Trademarks and Copyrights</h3>
                        <p>
                            Unless otherwise specified or expressly noted, TrustNews24 owns all intellectual property rights associated with the Website, including copyrights, patents, trademarks, trade names, service marks, designs, know-how, trade secrets, and other proprietary materials. You agree that you will not use, reproduce, or distribute any content from the Website belonging to TrustNews24 without obtaining prior authorization from TrustNews24.

                            However, if you upload or provide content such as text, images, videos, or other materials on the Website, you retain ownership of that content and are solely responsible for it. By posting content on the Website for public viewing, you grant a non-exclusive license for its use and reproduction by TrustNews24 and other third-party users of the Website.
                        </p>
                    </div>


                    <div>
                        <h3 className='font-medium text-xl mb-2'>
                            News Accuracy and Disclaimer
                        </h3>
                        <p>
                            TrustNews24 strives to ensure the accuracy and reliability of the news and information it provides. However, news is subject to change, and the Website cannot guarantee the accuracy, completeness, or timeliness of all content.
                            - The content provided on TrustNews24 is for general informational purposes only. We make no warranties, express or implied, regarding the reliability, accuracy, or completeness of the information.
                            - TrustNews24 may contain links to third-party websites or services that are not controlled by us. We are not responsible for the content, policies, or practices of any linked websites.
                        </p>
                    </div>

                    <div>
                        <h3 className='font-medium text-xl mb-2'>Advertisements and Sponsored Content</h3>
                        <p>
                            TrustNews24 may display advertisements from third parties on the Website. We do not endorse the products or services featured in these advertisements and are not liable for any claims or issues that may arise from interactions with these third-party advertisers.
                            Any sponsored articles or paid content will be clearly marked as such. TrustNews24 maintains editorial independence, and all opinions expressed in sponsored content are those of the author or sponsor.
                        </p>
                    </div>


                    <div>
                        <h3 className='font-medium text-xl mb-2'>Termination of Use</h3>
                        <p> TrustNews24 reserves the right to terminate or suspend your access to the Website at any time, without notice, for violating these Terms or engaging in any harmful conduct that could damage the Website, its reputation, or other users.</p>
                    </div>


                    <div>
                        <h3 className='font-medium text-xl mb-2'>Terms and Policy Updates</h3>
                        <p>TrustNews24 reserves the right to modify or update these terms and policies at any time by placing a notice on the Website. Any such changes will take immediate effect upon being posted. Please check back regularly for updates.</p>
                    </div>

                </div>
            </div>

        </>
    )
}