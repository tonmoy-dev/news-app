"use client"
import { Disclosure } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaRegUserCircle } from '@react-icons/all-files/fa/FaRegUserCircle';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SearchedNews from '../news/SearchedNews';
import { GoogleTranslator } from '../shared/Translator';

export default function NavigationBar({ liveLink, logo, logoAlt, categoriesNames, getPrefLangCookie, user }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const pathname = usePathname();
    const handleSearch = () => {
        setIsSearching(!isSearching);
    }
    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const navItems = categoriesNames?.map(category => ({
        name: category,
        current: pathname === `/category/${category}`,
        href: `/category/${category}` // Dynamic href based on category
    }));


    return (
        <Disclosure as="nav">
            {({ open, close }) => (
                <>
                    <div className="pb-1">
                        <div className="flex justify-between pb-2">
                            {/* large screen navbar */}
                            <div className="flex px-2 lg:px-0">
                                {/* logo */}
                                <div className="flex md:hidden flex-shrink-0 items-center">
                                    <Link href={"/"}>
                                        <Image
                                            className='w-[200px] h-[40px] object-cover'
                                            src={logo ? (`/assets/images/${logo}`) : "https://placehold.co/200x40.png"}
                                            alt={logoAlt}
                                            width={200}
                                            height={40}
                                        // blurDataURL="data:..." automatically provided
                                        // placeholder="blur" // Optional blur-up while loading
                                        />
                                    </Link>
                                </div>
                                <div className="hidden lg:flex lg:space-x-6 relative">
                                    <Link
                                        className={`inline-flex items-center border-b-2  px-1 pt-1 text-sm font-medium text-gray-500  
                                            ${pathname === '/'
                                                ? 'border-[#1091ff]  text-[#1091ff]'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        href="/">
                                        Home
                                    </Link>

                                    {navItems?.slice(0, 4)?.map(item => (
                                        <Link key={item?.name}
                                            className={`inline-flex items-center border-b-2  px-1 pt-1 text-sm font-medium text-gray-500 ${item?.current
                                                ? 'border-[#1091ff]  text-[#1091ff]'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                }`}
                                            href={item?.href}>
                                            {item?.name}
                                        </Link>
                                    ))}

                                    {/* <Link
                                        className={`inline-flex items-center border-b-2  px-1 pt-1 text-sm font-medium text-gray-500  
                                            ${pathname === '/district-news'
                                                ? 'border-[#1091ff]  text-[#1091ff]'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        href={"/district-news"}>
                                        Districts
                                    </Link> */}
                                    <Link
                                        className={`inline-flex items-center border-b-2  px-1 pt-1 text-sm font-medium text-gray-500  
                                            ${pathname === '/news-categories'
                                                ? 'border-[#1091ff]  text-[#1091ff]'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        href={"/news-categories"}>
                                        Categories
                                    </Link>
                                    <Link
                                        className={`inline-flex items-center border-b-2  px-1 pt-1 text-sm font-medium text-gray-500  
                                            ${pathname === '/contact'
                                                ? 'border-[#1091ff]  text-[#1091ff]'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        href={"/contact"}>
                                        Contact
                                    </Link>
                                    {/* More */}
                                    {navItems.length > 4 && (
                                        <div className="dropdown">
                                            <button
                                                className={`inline-flex items-center h-full px-1 pt-1 text-sm font-medium text-gray-500  border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 `}
                                            >
                                                More
                                            </button>
                                            <div className="dropdown-content">
                                                <ul className="py-1">
                                                    {navItems?.slice(4)?.map((item) => (
                                                        <Link key={item?.name}
                                                            className={`inline-flex items-center border-b-2  px-1 pt-1 text-sm font-medium text-gray-500 ${item?.current
                                                                ? 'border-[#1091ff]  text-[#1091ff]'
                                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                                }`}
                                                            href={item?.href}>
                                                            {item?.name}
                                                        </Link>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='hidden md:flex items-center justify-end  w-full text-[#17222b80] gap-4'>
                                {/* search button */}
                                <div className="mt-[6px]">
                                    <SearchedNews />
                                </div>

                                {/* user */}
                                <div>
                                    <Link href={`${user ? "/dashboard" : "/login"}`}>
                                        <FaRegUserCircle />
                                    </Link>
                                </div>
                            </div>

                            {/* small screen mobile menu button */}
                            <div className="me-2 flex items-center lg:hidden">
                                {/* user */}
                                <div className='mr-1'>
                                    <Link href={`${user ? "/dashboard" : "/login"}`}>
                                        <FaRegUserCircle className="block h-5 w-5 text-[#17222b80]" />
                                    </Link>
                                </div>
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 ">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            {/* large screen right side menu */}
                            <div className="hidden lg:ml-4 lg:flex lg:items-center">
                                {/* google translate */}
                                {/* <GoogleTranslate prefLangCookie={() => getPrefLangCookie()} /> */}

                                <GoogleTranslator prefLangCookie={() => getPrefLangCookie()} />

                                {/* live news */}
                                <div className="live-news-btn">
                                    <a href={liveLink} target='_blank'>
                                        Live
                                    </a>
                                </div>
                            </div>

                        </div>
                        {/* search option */}
                        {
                            isSearching && (
                                <div className="w-2/3 mx-auto my-1">
                                    <label htmlFor="search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="search"
                                            name="search"
                                            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-[#1091ff] focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1091ff] sm:text-sm"
                                            placeholder="Search"
                                            type="search"
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    {/* small screen mobile navigation */}
                    <Disclosure.Panel className="lg:hidden relative">
                        <div className="space-y-1 pt-2 pb-3 absolute bg-[#eff5f4] w-full px-4 z-50">

                            <Link
                                onClick={close}
                                className={`block border-l-4   py-2 pl-3 pr-4 text-base font-medium  ${pathname === '/'
                                    ? 'border-[#1091ff]  text-[#1091ff]'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                href="/"
                            >Home
                            </Link>
                            {
                                navItems?.map(item => {
                                    return (
                                        <Link
                                            onClick={close}
                                            key={item?.name}
                                            className={`block border-l-4   py-2 pl-3 pr-4 text-base font-medium  ${item?.current
                                                ? 'border-[#1091ff]  text-[#1091ff]'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                }`}
                                            href={item?.href}>
                                            {item?.name}
                                        </Link>
                                    )
                                })
                            }
                            {/* <Link
                                         onClick={close}
                                        className={`block border-l-4  py-2 pl-3 pr-4 text-base font-medium  ${pathname === '/district-news'
                                            ? 'border-[#1091ff]  text-[#1091ff]'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        href={"/district-news"}>
                                        Districts
                                    </Link> */}
                            <Link
                                onClick={close}
                                className={`block border-l-4   py-2 pl-3 pr-4 text-base font-medium  ${pathname === '/news-categories'
                                    ? 'border-[#1091ff]  text-[#1091ff]'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                href={"/news-categories"}>
                                Categories
                            </Link>
                            <Link
                                onClick={close}
                                className={`block border-l-4   py-2 pl-3 pr-4 text-base font-medium  ${pathname === '/contact'
                                    ? 'border-[#1091ff]  text-[#1091ff]'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                href={"/contact"}>
                                Contact
                            </Link>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}


