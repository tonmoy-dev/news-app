import ReportersListTable from "@/components/dashboard/reporters/ReportersListTable";
import { apiRequestHandler } from "@/utils/requestHandlers";

export const dynamic = 'force-dynamic';

export default async function ReportersList() {
    const reportersData = await apiRequestHandler('/users', { filter: [{ role: 'reporter' }] });


    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">Reporters ({reportersData?.length})</h1>
            </div>
            <ReportersListTable reportersData={reportersData} />
        </>
    )
}