import TrendingSocials from "../shared/TrendingSocials";
import ContactForm from "./ContactForm";

export default function ContactArea() {
    return (
        <>
            {/* <!--====== CONTACT PART START ======--> */}
            <section className="contact-area pb-10 px-4 md:px-0">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                        <div className="md:col-span-8">
                            {/* <!--====== CONTACT Form ======--> */}
                            <div className="contact-box p-5 bg-[#E9EAEB]">
                                <ContactForm />
                            </div>
                        </div>
                        <div className="md:col-span-4">
                            <div className="contact-sidebar bg-[#E9EAEB] space-y-4">
                                <TrendingSocials />
                                {/* <NewsletterBox /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!--====== CONTACT PART ENDS ======--> */}
        </>
    )
}