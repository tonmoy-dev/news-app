import ContactArea from "@/components/main/contact/ContactArea";
import ContactInfo from "@/components/main/contact/ContactInfo";
import Breadcrumb from '@/components/main/shared/Breadcrumb';
import fetchData from "@/utils/fetchData";

export const dynamic = 'force-dynamic';
// export const revalidate = 10;   // revalidate in 10 seconds

export async function generateMetadata() {
    const pageData = await fetchData(`/api/site-settings/meta-info?page=Contact`);
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


export default async function ContactPage() {
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
                <Breadcrumb page1={"Contact"} pageLink1={"/contact"} page2={""} pageLink2={"#"} />
                <ContactInfo />
                <ContactArea />
            </div>
        </>
    )
}