import Image from "next/image";
import Link from "next/link";

export default async function Logo({ logo, logoAlt }) {

  return (
    <>
      <div className="header-centerbar hidden md:block">
        <div className="container mx-auto">
          <div className="flex gap-2">
            <div className="w-2/5 mx-auto">
              <div className="logo">
                <Link href="/">
                  <Image
                    className='w-[400px] h-[70px] object-cover'
                    src={logo ? (`/assets/images/${logo}`) : 'https://placehold.co/400x70.png'}
                    alt={logoAlt}
                    width={400}
                    height={70}
                    priority={false}
                  // blurDataURL="data:..." automatically provided
                  // placeholder="blur" // Optional blur-up while loading
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}