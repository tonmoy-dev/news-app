import Image from "next/image";
import Link from "next/link";
import { Toaster } from "react-hot-toast";


export default function LoginLayout({ children, siteName, footer_logo_img, logo_alt }) {

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            duration: 3000,
          },
        }}
      />
      <div>
        <div className="mt-6 flex items-center justify-center  md:justify-start ms-0 md:ms-6">
          <Link href={"/"}>
            <Image
              className='w-[300px] h-[50px] object-cover'
              src={footer_logo_img ? (`/assets/images/${footer_logo_img}`) : "https://placehold.co/300x50.png"}
              alt={logo_alt}
              width={300}
              height={50}
            // blurDataURL="data:..." automatically provided
            // placeholder="blur" // Optional blur-up while loading
            />
          </Link>
        </div>
        <div className="min-h-screen flex flex-col justify-center items-center">
          <div className="mt-[-60px] bg-white shadow-none sm:shadow-lg px-8 sm:px-12 w-full xs:w-full sm:w-8/12 md:w-7/12 lg:w-7/12 xl:w-2/6 py-8 rounded-lg">
            <div className="text-center w-full font-bold text-3xl text-gray-600 p-4">
              Login
            </div>
            <div className="w-full bg-gray-200 my-3" style={{ height: 1 }} />
            {children}
          </div>
          <div className="my-4 md:my-8">
            <span>© {siteName} 2024</span>
          </div>
        </div>
      </div>
    </>
  );
};