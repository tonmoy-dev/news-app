"use client"

import { apiRequestHandler } from '@/utils/requestHandlers';
import { BsSearch } from '@react-icons/all-files/bs/BsSearch';
import { Empty, Input } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const SearchedNews = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {

    // Fetch news articles based on the search term
    if (e.key === 'Enter') {
      let data = [];

      try {
        data = await apiRequestHandler('/news', { search: [{ title: `${searchTerm}` }] })

        if (data) {
          setSearchResults(data);
        }
      } catch (error) {
        setSearchResults(data);
      }
    }
  };

  const handleClose = () => {
    setSearchVisible(false);
    setSearchResults([]);
    setSearchTerm('');
  }

  return (
    <div className="relative">
      {searchVisible && (
        <div className="absolute top-10 right-0 w-[700px] z-10">
          <Input
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className=""
          />
          {searchResults?.length > 0 ? (
            <div className="bg-white p-3 rounded shadow-lg">
              <div className="mb-2 text-gray-600 mx-auto text-center">
                <span>{searchResults.length} results found</span>
              </div>
              {searchResults?.slice(0, 10)?.map((news) => (
                <Link key={news.id} href={`/posts/${news.id}`} onClick={handleClose} passHref>
                  <div className="flex items-center p-2 hover:bg-gray-200 rounded gap-5">
                    <Image
                      className='w-[100px] h-[50px] object-cover'
                      src={news.thumbnail_img_small ? `/assets/images/${news.thumbnail_img_small}` : "https://placehold.co/100x50.png"}
                      alt={news.title}
                      width={100}
                      height={50}
                    />
                    <h3 className="text-black">{news.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-4 rounded shadow-lg">
              <Empty description={<span>No data found</span>} />
            </div>
          )}
        </div>
      )}
      {
        searchVisible ? (
          <button onClick={handleClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        ) : (
          <button onClick={() => setSearchVisible((prev) => !prev)}>
            <BsSearch />
          </button>
        )
      }
    </div>
  );
};

export default SearchedNews;
