import PrintPost from "@/components/main/print/PrintPost";

export const dynamic = 'force-dynamic';


export default async function PostPrintPage({ params }) {
    const { postId: id } = params;

    // fetch single post data
    const res = await fetch(`${process.env.AUTH_URL}/api/news/${id}`);
    const data = await res.json();

    if (!data) return <div>Loading...</div>;
    return (
        <>
            <PrintPost post={data} />
        </>
    )
}