"use server"

import { authConfig } from "@/utils/auth.config";
import { dataFetcher } from "@/utils/fetcher/dataFetcher";
import NextAuth from "next-auth";
import Logo from "./Logo";
import NavigationBar from "./NavigationBar";
import TopBar from "./TopBar";


const { auth } = NextAuth(authConfig);

export const getPrefLangCookie = () => {
    // This function will be used in client-side components
    if (typeof window !== 'undefined') {
        const cookieValue = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
        return cookieValue ? cookieValue.split('=')[1] : 'en'; // Default to English if no cookie is found
    }
    return 'en'; // Fallback for server-side context
};


export default async function Header({ categoriesNames }) {
    const session = await auth();

    const breakingNews = await dataFetcher('/news/breaking-news');
    const siteSettings = await dataFetcher('/site-settings');
    const activeSocials = await dataFetcher('/site-settings/socials', { status: true });

    const { header_logo_img, logo_alt, live_show_link, footer_logo_img } = siteSettings?.[0];


    return (
        <>
            {/* <!--====== HEADER PART START ======--> */}
            <header className="header-area bg-white">
                <div className="main-container">
                    <TopBar breakingNews={breakingNews} socials={activeSocials} />
                    <Logo logo={header_logo_img} logoAlt={logo_alt} />
                    <NavigationBar user={session?.user} categoriesNames={categoriesNames} liveLink={live_show_link} logo={footer_logo_img} logoAlt={logo_alt} getPrefLangCookie={getPrefLangCookie} />
                    {/* <SearchedNews /> */}
                </div>
            </header>
            {/* <!--====== HEADER PART ENDS ======--> */}
        </>
    )
}
