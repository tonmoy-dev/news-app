import PagesListTable from "@/components/dashboard/meta-info/PagesListTable";
import fetchData from "@/utils/fetchData";

export const dynamic = 'force-dynamic';

export default async function PagesListPage() {
  const pagesMetaData = await fetchData('/api/site-settings/meta-info');

  return (
    <>
      <div className="mx-auto text-left mb-4" >
        <h1 className="text-xl font-medium text-gray-900">Pages</h1>
      </div>
      <PagesListTable pagesData={pagesMetaData} />
    </>
  )
}
