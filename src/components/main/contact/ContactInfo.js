import fetchData from "@/utils/fetchData";
import { MapPinIcon } from "@heroicons/react/20/solid";
import { FaEnvelope } from "@react-icons/all-files/fa/FaEnvelope";
import { FaPhoneAlt } from "@react-icons/all-files/fa/FaPhoneAlt";

export default async function ContactInfo() {
    const siteSettings = await fetchData('/api/site-settings');
    const { google_map_link, location, telephone, email } = siteSettings?.[0];

    return (
        <>
            {/* <!--====== CONTACT INFO ======--> */}
            <div className="contact-info-area mb-16 mt-12 px-4 md:px-0">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-4 ">
                        <div className="col-lg-4 col-md-6">
                            <div className="contact-info-item mt-30">
                                <h3 className="title mb-1">Headquarters</h3>
                                <span>
                                    <i>
                                        <MapPinIcon className="h-4 w-4 inline" />
                                    </i>
                                    LOCATION:
                                </span>
                                <ul>
                                    <li>{location}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="contact-info-item mt-30">
                                <h3 className="title mb-1">Let’s talk</h3>
                                <span>
                                    <i>
                                        <FaPhoneAlt className="inline" />
                                    </i>
                                    CALL NOW:
                                </span>
                                <ul>
                                    <li>{telephone}</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="contact-info-item mt-30">
                                <h3 className="title mb-1">Let’s chat</h3>
                                <span>
                                    <i>
                                        <FaEnvelope className="inline" />
                                    </i>
                                    EMAIL:
                                </span>
                                <ul>
                                    <li>{email}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="map-area">
                                <iframe
                                    src={google_map_link}
                                    width={600}
                                    height={450}
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    aria-hidden="false"
                                    tabIndex={0}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}