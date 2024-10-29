import MostViewsNewsSlider from "./MostViewsNewsSlider";

export default function MostViewsNewsSidebar({ news }) {

  return (
    <div className="p-5 bg-white">
      <div className="trending-most-view">
        <div className="section-title">
          <h3 className="title">Most View</h3>
        </div>
      </div>
      <div className="trending-sidebar-slider">
        <MostViewsNewsSlider news={news} />
      </div>
    </div>

  )
}