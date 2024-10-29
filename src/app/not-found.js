
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex items-center h-screen p-16 bg-gray-900 dark:bg-gray-50 text-gray-100 dark:text-gray-800">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto">
        <div className="max-w-md text-center">
          <p className="mb-4 text-7xl font-extrabold tracking-tight text-[#ff5555] lg:text-9xl">
            <span className="sr-only">Error</span>404
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-700 sm:text-5xl">Page not found</h1>
          <p className="mt-6 text-base leading-7 text-gray-500">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
          <div style={{ marginTop: '20px' }}>
            <Link href="/" className="px-8 py-3 font-semibold rounded bg-[#ff5555] text-gray-100">
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
