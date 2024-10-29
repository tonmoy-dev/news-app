import FeaturedNewsSlider from "./FeaturedNewsSlider";

export default function FeaturedNews({ news }) {

    return (
        <>
            {/* <!--====== FEATURE PART START ======--> */}
            <section className="feature-area p-5 bg-white my-4">
                <div className="container px-4 lg:px-0">
                    <div className="section-title">
                        <h3 className="title">Feature News</h3>
                    </div>
                    <div className=" feature-post-slider">
                        <FeaturedNewsSlider news={news} />
                    </div>
                </div>
            </section>

            {/* <!--====== FEATURE PART ENDS ======--> */}
        </>
    )
}
