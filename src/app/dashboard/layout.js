import DashboardLayout from '@/components/layouts/DashboardLayout';
import { auth } from "@/utils/auth";
import fetchData from '@/utils/fetchData';
import { apiRequestHandler } from '@/utils/requestHandlers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata = {
  title: "Dashboard",
  description: "Website Dashboard",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  const siteSettings = await fetchData('/api/site-settings');

  const usersResponse = await apiRequestHandler('/users', {
    filter: [
      { email: session?.user?.email },
    ],
  });
  const userInfo = usersResponse?.[0];

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AntdRegistry>
            <DashboardLayout siteSettings={siteSettings} user={session?.user} userInfo={userInfo}>
              {children}
            </DashboardLayout>
          </AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
