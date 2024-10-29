import BreakingNewsList from "@/components/dashboard/news/BreakingNewsList";
import { auth } from "@/utils/auth";
import fetchData from "@/utils/fetchData";

export const dynamic = 'force-dynamic';

export default async function BreakingNewsPage() {
    const session = await auth();
    const { email, role } = session?.user;

    let newsData;
    if (role === "admin") {
        newsData = await fetchData('api/news/breaking-news');
    } else if (role === "editor" || "reporter") {
        newsData = await fetchData(`api/news/breaking-news?reporter_email=${email}`);
    }

    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">
                    Breaking News
                </h1>
            </div>
            <BreakingNewsList data={newsData} user={session?.user} />
        </>
    )
}