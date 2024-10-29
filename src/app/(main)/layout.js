import MainLayout from "@/components/layouts/MainLayout";
import { SessionProvider } from 'next-auth/react';
import 'react-loading-skeleton/dist/skeleton.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import "../../assets/css/style.css";
import "./globals.css";


export const metadata = {
  title: 'Your Website Name',
  description: 'Welcome to our website',
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
