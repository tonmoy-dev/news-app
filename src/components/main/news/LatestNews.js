import LatestNewsSlider from "./LatestNewsSlider";

export default async function LatestNews({ news }) {

    return (
        <>
            {/* <!--====== POST PART ======--> */}
            <div className="p-5 bg-white my-4">
                <div className="post-slider">
                    <LatestNewsSlider news={news} />
                </div>
            </div>
        </>
    )
}
