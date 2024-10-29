const LatestNewsSliderSkeleton = () => {
  return (
    <div className="w-[500px] animate-pulse flex items-center gap-4">
      <div className="h-6 bg-gray-200 rounded w-[80px] h-[80px]"></div>
      <div className="space-y-2 w-1/2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

export default LatestNewsSliderSkeleton;