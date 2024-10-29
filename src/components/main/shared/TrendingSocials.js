import fetchData from "@/utils/fetchData";
import { FaFacebookF } from "@react-icons/all-files/fa/FaFacebookF";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaYoutube } from "@react-icons/all-files/fa/FaYoutube";

export default async function TrendingSocials() {
    const socials = await fetchData('/api/site-settings/socials?status=true');

    // Get the counts individually
    const facebookData = socials?.find(social => social?.name === "Facebook");
    const instagramData = socials?.find(social => social?.name === "Instagram");
    const youtubeData = socials?.find(social => social?.name === "YouTube");
    const twitterData = socials?.find(social => social?.name === "Twitter");

    return (
        <>
            <div className="trending-social mt-0 p-5">
                <div className="section-title">
                    <h3 className="title">Follow Us</h3>
                </div>
                <ul>
                    {
                        facebookData && (
                            <li>
                                <a href={facebookData?.link} target="_blank">
                                    <i>
                                        <FaFacebookF color="#ffffff" />
                                    </i>
                                    <div className="text-sm ml-1">
                                        <span>
                                            {/* {facebookData.counts} */}
                                            Facebook
                                        </span>
                                        <p>Join here</p>
                                    </div>
                                </a>
                            </li>
                        )
                    }

                    {
                        twitterData && (
                            <li>
                                <a className="item-2" href={twitterData?.link} target="_blank">
                                    <i>
                                        <FaTwitter color="#ffffff" />
                                    </i>
                                    <div className="text-sm ml-1">
                                        <span>
                                            {/* {twitterData?.counts} */}
                                            Twitter
                                        </span>
                                        {/* <p>Followers</p> */}
                                        <p>Join here</p>
                                    </div>
                                </a>
                            </li>
                        )
                    }
                    {
                        youtubeData && (
                            <li>
                                <a className="item-3" href={youtubeData?.link} target="_blank">
                                    <i>
                                        <FaYoutube color="#ffffff" />
                                    </i>
                                    <div className="text-sm ml-1">
                                        <span>
                                            {/* {youtubeData?.counts} */}
                                            Youtube
                                        </span>
                                        {/* <p>Subscribers</p> */}
                                        <p>Join here</p>
                                    </div>
                                </a>
                            </li>
                        )
                    }
                </ul>
            </div>
        </>
    )
}