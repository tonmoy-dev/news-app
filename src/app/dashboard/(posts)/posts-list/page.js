import PostListTable from "@/components/dashboard/posts/PostListTable";
import { auth } from "@/utils/auth";
import fetchData from "@/utils/fetchData";
import { dataFetcher } from "@/utils/fetcher/dataFetcher";
import { apiRequestHandler } from "@/utils/requestHandlers";

export const dynamic = 'force-dynamic';

export default async function PostsListPage() {
    const session = await auth();
    const categories = await dataFetcher('/categories', { status: 1 });

    const { role, email, id, name } = session?.user;

    let newsData = [];

    // Fetch data based on user role
    if (role === 'admin') {
        newsData = await fetchData('/api/news');
    } else if (role === 'reporter' || role === 'editor') {
        newsData = await apiRequestHandler('/news', {
            filter: [
                { reporter: name },
            ],
            sort: [
                { published_date: 'desc' }
            ]
        });
    }


    const categoriesNames = categories?.map(item => item.name);

    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">Posts ({newsData?.length})</h1>
            </div>
            <PostListTable news={newsData} categoriesNames={categoriesNames} />
        </>
    )
}