import fetchData from '@/utils/fetchData';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

export const dynamic = 'force-dynamic';
// export const revalidate = 10;   // revalidate in 10 seconds


const pages = [
    { name: 'Privacy Policy', href: '#', current: true },
]

export async function generateMetadata() {
    const pageData = await fetchData(`/api/site-settings/meta-info?page=PrivacyPolicy`);
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

export default async function PrivacyPolicyPage() {
    const siteSettings = await fetchData('/api/site-settings');
    const { privacy_policy } = siteSettings?.[0];
    const pageData = await fetchData(`/api/site-settings/meta-info?page=PrivacyPolicy`);
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
                    <div>
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
                        <h3 className="text-2xl font-medium">Privacy Policy</h3>
                    </div>
                </div>

                {/* privacy policy notes */}
                <div className='space-y-6 mx-4 md:mx-0'>
                    <div dangerouslySetInnerHTML={{ __html: privacy_policy }} />
                    <div>
                        <h2 className='text-xl font-medium mb-1'>News</h2>
                        <p>
                            At Trust News24 – Dinajpur News, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Trust News24 – Dinajpur News and how we use it.

                            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                        </p>
                    </div>
                    <div>
                        <h2 className='text-xl font-medium mb-1'>Log Files</h2>

                        <p>
                            Trust News24 – Dinajpur News follows a standard procedure of using log files. These files log visitors when they use the app. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the app, tracking users’ movement on the app, and gathering demographic information.
                        </p>
                    </div>
                    <div>
                        <h2 className='text-xl font-medium mb-1'>Our Advertising Partners</h2>
                        <p>
                            Some of the advertisers in our app may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has its own Privacy Policy for its policies on user data. For easier access, we hyperlinked to their Privacy Policies below.
                        </p>
                    </div>
                    <div>
                        <h2 className='text-xl font-medium mb-1'>Privacy Policies</h2>
                        <p>
                            You may consult this list to find the Privacy Policy for each of the advertising partners of Trust News24 – Dinajpur News.
                        </p>
                    </div>
                    <div>
                        <h2 className='text-xl font-medium mb-1'>Third-Party Privacy Policies</h2>
                        <p>
                            Trust News24 – Dinajpur News’s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt out of certain options.
                        </p>
                    </div>
                    <div>
                        <h2 className='text-xl font-medium mb-1'>Children’s Information</h2>
                        <p>
                            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.

                            Trust News24 – Dinajpur News does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our App, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
                        </p>
                    </div>
                    <div>
                        <h2 className='text-xl font-medium mb-1'>
                            Online Privacy Policy Only
                        </h2>

                        <p>
                            This Privacy Policy applies only to our online activities and is valid for visitors to our App with regards to the information that they shared and/or collect in Trust News24 – Dinajpur News. This policy is not applicable to any information collected offline or via channels other than this app.
                        </p>
                    </div>
                    <div>
                        <h2 className='text-xl font-medium mb-1'>Consent</h2>
                        <p>
                            By using our app, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}