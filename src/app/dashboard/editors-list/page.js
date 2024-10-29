import EditorsListTable from "@/components/dashboard/editors/EditorsListTable";
import { apiRequestHandler } from "@/utils/requestHandlers";

export const dynamic = 'force-dynamic';

export default async function EditorsListPage() {
    const editorsData = await apiRequestHandler('/users', { filter: [{ role: 'editor' }] });

    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">Editors ({editorsData?.length})</h1>
            </div>
            <EditorsListTable editorsData={editorsData} />
        </>
    )
} 