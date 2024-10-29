import { formattedDate } from "@/utils/format-date";
import Image from "next/image";
import Link from "next/link";

const NewsColumn = ({ category, newsData }) => {

  // Filter news by category
  const filteredNews = newsData?.filter((news) => news?.category === category);

  return (
    <div className="bg-white shadow p-5 pb-1">
      <h2 className="text-xl font-medium mb-4 pb-4 border-b">{category} News</h2>
      {filteredNews?.slice(0, 5)?.map((news) => (
        <div key={news?.id} className="flex items-start gap-4 mb-4 border-b pb-4">
          <Image
            className='w-[110px] h-[85px] '
            src={news?.thumbnail_img_small ? (`/assets/images/${news?.thumbnail_img_small}`) : "https://placehold.co/110x85.png"}
            alt={news?.title}
            width={110}
            height={85}
          // blurDataURL="data:..." automatically provided
          // placeholder="blur" // Optional blur-up while loading
          />
          <div>
            <h4 className="title">
              <Link
                href={`/posts/${news?.id}`}
                className='text-sm'>
                {news?.title.slice(0, 45)}...
              </Link>
            </h4>
            <p>
              <span className="text-gray-500 text-xs">{formattedDate(news?.published_date)}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsColumn;