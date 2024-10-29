import CommentsManager from "@/components/dashboard/user/CommentsManager";
import fetchData from "@/utils/fetchData";

export const dynamic = 'force-dynamic';

export default async function CommentsPage() {
    const comments = await fetchData('/api/post-comments');

    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">All Comments ({comments.length})</h1>
            </div>
            <CommentsManager comments={comments} />
        </>
    )
}