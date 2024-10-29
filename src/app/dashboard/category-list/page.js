import CategoryListTable from "@/components/dashboard/category/CategoryListTable";
import fetchData from "@/utils/fetchData";

export const dynamic = 'force-dynamic';

export default async function CategoryListPage() {
    const categories = await fetchData('/api/categories');

    return (
        <>   <div className="mx-auto text-left mb-4" >
            <h1 className="text-xl font-medium text-gray-900">Category List</h1>
        </div>
            <CategoryListTable categoriesData={categories} />
        </>
    )
}