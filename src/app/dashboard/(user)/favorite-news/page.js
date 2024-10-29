import FavNewsTable from "@/components/dashboard/user/fav-news/FavNewsTable";
import { authConfig } from "@/utils/auth.config";
import fetchData from "@/utils/fetchData";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export const dynamic = 'force-dynamic';

export default async function FavoriteNewsPage() {
    const session = await auth();
    const newsData = await fetchData(`/api/news/favorite-news?email=${session?.user?.email}`);

    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">Favorite News ({newsData?.length})</h1>
            </div>
            <FavNewsTable email={session?.user?.email} news={newsData} />
        </>
    )
}