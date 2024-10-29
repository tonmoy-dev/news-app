export default function FeaturedNewsSliderSkeleton() {

  return (
    <div className="p-5 bg-white my-4">
      <div className="px-4 lg:px-0">
        <div className="h-4 bg-gray-200 rounded w-1/6 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="w-[250px] h-[310px] bg-gray-200 rounded"></div>
          <div className="w-[250px] h-[310px] bg-gray-200 rounded"></div>
          <div className="w-[250px] h-[310px] bg-gray-200 rounded"></div>
          <div className="w-[250px] h-[310px] bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};