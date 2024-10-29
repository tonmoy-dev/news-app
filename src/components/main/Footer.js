import { dataFetcher } from "@/utils/fetcher/dataFetcher";
import { MapPinIcon } from "@heroicons/react/20/solid";
import { FaEnvelope } from "@react-icons/all-files/fa/FaEnvelope";
import { FaMobileAlt } from "@react-icons/all-files/fa/FaMobileAlt";
import Image from "next/image";
import Link from "next/link";

export default async function Footer() {
    const siteSettings = await dataFetcher('/site-settings');
    const { footer_logo_img, logo_alt, footer_text, copyright_text, google_play_app_link, apple_play_app_link, location, phone, email, banner_ads_img } = siteSettings?.[0];

    return (
        <>
            <div className="main-container">
                {/* <!--====== ADs PART  ======--> */}
                <div className="my-2 md:my-8 text-center w-full md:w-auto">
                    <a href="#">
                        <Image
                            className='w-full h-[120px] object-contain md:object-cover'
                            src={banner_ads_img ? (`/assets/images/${banner_ads_img}`) : "https://placehold.co/970x120.png"}
                            alt="ads banner"
                            width={970}
                            height={120}
                        // blurDataURL="data:..." automatically provided
                        // placeholder="blur" // Optional blur-up while loading
                        />
                    </a>
                </div>
            </div>
            {/* <!--====== FOOTER PART START ======--> */}
            <footer className="footer-top-border">
                <div className="main-container px-4 lg:px-0">
                    <div className="footer-logo hidden-xs">
                        <div className="container">
                            <div className="flex flex-col md:flex-row justify-start md:justify-between gap-5">
                                <div>
                                    <Link href={"/"}>
                                        <Image
                                            className='w-[300px] h-[50px] object-cover'
                                            src={footer_logo_img ? (`/assets/images/${footer_logo_img}`) : "https://placehold.co/300x50.png"}
                                            alt={logo_alt}
                                            width={300}
                                            height={50}
                                        // blurDataURL="data:..." automatically provided
                                        // placeholder="blur" // Optional blur-up while loading
                                        />
                                    </Link>
                                </div>
                                <div className="apps w-full md:w-1/3 flex gap-2">
                                    <a
                                        href={google_play_app_link}
                                        rel="nofollow"
                                        target="_blank"
                                        className="me-1 w-auto"
                                    >
                                        <Image
                                            src="/assets/images/media-apps/android-app.png"
                                            alt="Android App"
                                            title="Android"
                                            width={175}
                                            height={50}
                                        />
                                    </a>
                                    <a
                                        href={apple_play_app_link}
                                        rel="nofollow"
                                        target="_blank"
                                        className="w-auto"
                                    >
                                        <Image
                                            src="/assets/images/media-apps/apple-app.png"
                                            alt="Apple App"
                                            title="Apple"
                                            width={175}
                                            height={50}
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-top navbar-static-top navbar-inverse hidden-xs">
                        <div className="container">
                            <div className="our-text">
                                <h1>Newspark is one of the popular Bangla news portal.</h1>
                                <div dangerouslySetInnerHTML={{ __html: footer_text }} />
                                <div>
                                    {/* <p>
                                        It has begun with commitment of fearless, investigative, informative
                                        and independent journalism. This online portal has started to
                                        provide real time news updates with maximum use of modern technology
                                        from May 10th 2014. Latest &amp; breaking news of home and abroad,
                                        entertainment, lifestyle, special reports, politics, economics,
                                        culture, education, information technology, health, sports, columns
                                        and features are included in it. A genius team of Jago News has been
                                        built with a group of country&apos;s energetic young journalists. We are
                                        trying to build a bridge with Bengali&apos;s around the world and adding
                                        a new dimension to online news portal. The home of materialistic
                                        news.
                                    </p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="container">
                            <div className="grid grid-cols-1 md:grid-cols-12">
                                <div className="md:col-span-6">
                                    <div className="text-black">
                                        <span>
                                            © {copyright_text}
                                            {/* Copyright 2024, All Rights Reserved */}
                                        </span>
                                        <br />
                                        <MapPinIcon className="w-4 h-4 inline" />
                                        <span> {" "}
                                            {location}
                                        </span>
                                        <br />
                                        <abbr title="Phone:">
                                            <FaMobileAlt className="inline" />
                                        </abbr>{" "}
                                        {phone} <br />
                                        <span className="">
                                            <abbr title="Email:">
                                                <FaEnvelope className="inline" />
                                            </abbr>{" "}
                                            {email}
                                        </span>
                                    </div>
                                </div>
                                <div className="md:col-span-6 footer-top">
                                    <ul className="footer-menu text-right">
                                        <li >
                                            <Link href="/">Home</Link>
                                        </li>
                                        <li>
                                            <Link href="/contact">Contact Us</Link>
                                        </li>
                                        <li>
                                            <Link href="/terms-conditions">Terms & Conditions</Link>
                                        </li>
                                        <li>
                                            <Link href="/privacy-policy">Privacy Policy</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </footer>

            {/* <!--====== FOOTER PART ENDS ======--> */}
        </>
    )
}