import BookmarkedNewsTable from "@/components/dashboard/user/bookmark-news/BookmarkedNewsTable";
import { authConfig } from "@/utils/auth.config";
import fetchData from "@/utils/fetchData";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export const dynamic = 'force-dynamic';

export default async function BookmarkedNewsPage() {
    const session = await auth();
    const newsData = await fetchData(`/api/news/bookmarked-news?email=${session?.user?.email}`);

    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">Bookmarked News ({newsData?.length})</h1>
            </div>
            <BookmarkedNewsTable email={session?.user?.email} news={newsData} />
        </>
    )
}