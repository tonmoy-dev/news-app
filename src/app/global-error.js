'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Error caught in error.js:', error);
  }, [error]);

  return (
    <section className="bg-white flex items-center h-screen ">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-[#ff5555] lg:text-9xl">500</h1>
          <p className="mb-4 text-black text-3xl font-bold tracking-tight text-gray-700 md:text-4xl">Internal Server Error.</p>
          <p></p>
          <p className="mb-4 text-lg font-light text-gray-500">
            {/* {error.message},  */}
            Something went wrong!</p>
          <Link href="/" className="px-8 py-3 font-semibold rounded bg-[#ff5555] text-white">
            Try Again
          </Link>
          {/* <button onClick={() => reset()}>Try again</button> */}
        </div>
      </div>
    </section>
  );
}
