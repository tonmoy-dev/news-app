import AddMetaInfoForm from "@/components/dashboard/meta-info/AddMetaInfoForm";
import fetchData from "@/utils/fetchData";

export const dynamic = 'force-dynamic';

export default async function AddPage() {
    const pagesMetaData = await fetchData('/api/site-settings/meta-info');

    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">Add Page Meta Info</h1>
            </div>
            <AddMetaInfoForm metaData={pagesMetaData} />
        </>
    )
}


