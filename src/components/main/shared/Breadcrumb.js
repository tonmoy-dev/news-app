import { ChevronLeftIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';

export default function Breadcrumb({ page1, pageLink1, page2, pageLink2 }) {
    const pages = [
        { name: page1, href: pageLink1, current: true },
        { name: page2, href: pageLink2, current: true },
    ];

    return (
        <>
            {/*====== Breadcrumb ======*/}
            <div className="mx-4 md:mx-0">
                <nav className="flex mt-4 text-sm" aria-label="Breadcrumb">
                    <ol role="list" className="flex items-center space-x-2">
                        <li>
                            <div>
                                <Link href="/" className="text-gray-400 hover:text-gray-500">
                                    <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                    <span className="sr-only">Home</span>
                                </Link>
                            </div>
                        </li>
                        {pages.filter(page => page.name !== "").map((page) => (
                            <li key={page.name}>
                                <div className="flex items-center">
                                    <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                    <Link href={page.href}
                                        className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                                        aria-current={page.current ? 'page' : undefined}>
                                        {page.name}
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>
        </>
    )
}