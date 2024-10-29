
import { FaFacebookF } from "@react-icons/all-files/fa/FaFacebookF"
import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram"
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter"
import { FaYoutube } from "@react-icons/all-files/fa/FaYoutube"

// get formatted date
const today = new Date();
const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};
const formattedDate = today.toLocaleDateString('en-US', options);

export default function TopBar({ breakingNews, socials }) {

    return (
        <>
            <div className="header-topbar">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 items-center">
                        {/* <!--====== Topbar Trending ======--> */}
                        <div className="">
                            <div className="topbar-trending">
                                <span className="inline-block">Breaking News</span>
                                <div className="trending-slider flex">
                                    <div className="trending-item w-full">
                                        <marquee width="100%" direction="left" height="auto">
                                            {
                                                breakingNews.length > 0 ? (
                                                    <>
                                                        {
                                                            breakingNews.slice(-1).map(news => (
                                                                <p key={news.id}>{news?.title}</p>
                                                            ))
                                                        }
                                                    </>
                                                ) : (
                                                    <p>Wait for next breaking news!</p>
                                                )
                                            }
                                        </marquee>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!--====== Date, Topbar Social ======--> */}
                        <div className="">
                            <div className="topbar-social flex items-center">
                                <p>
                                    {formattedDate}
                                </p>
                                <div className="me-2">
                                    <ul className="flex items-center gap-2">
                                        {
                                            socials?.map(item => (
                                                <li key={item?.id}>
                                                    <a href={item?.link} target="_blank">
                                                        {item?.name === "Facebook" && <FaFacebookF />}
                                                        {item?.name === "Twitter" && <FaTwitter />}
                                                        {item?.name === "YouTube" && <FaYoutube />}
                                                        {item?.name === "Instagram" && <FaInstagram />}
                                                    </a>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}