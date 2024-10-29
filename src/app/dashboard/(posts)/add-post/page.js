import AddPostForm from "@/components/dashboard/posts/AddPostForm";
import { dataFetcher } from "@/utils/fetcher/dataFetcher";
import { apiRequestHandler } from "@/utils/requestHandlers";

export const dynamic = 'force-dynamic';

export default async function AddPostPage() {
    const categories = await dataFetcher('/categories', { status: 1 });
    const reporters = await apiRequestHandler('/users', {
        filter: [
            { role: 'reporter' },
            { status: 'active' },
            // { role: 'editor' },
        ],
    });
    const editors = await apiRequestHandler('/users', {
        filter: [
            { role: 'editor' },
            { status: 'active' },
        ],
    });

    const reportersNames = reporters?.map(item => item.full_name);
    const editorsNames = editors?.map(item => item.full_name);
    const categoriesNames = categories?.map(item => item.name);

    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">Add Post</h1>
            </div>
            <AddPostForm categoriesNames={categoriesNames} reportersNames={reportersNames} editorsNames={editorsNames} />
        </>
    )
}