import UsersListTable from "@/components/dashboard/user/UsersListTable";
import { dataFetcher } from "@/utils/fetcher/dataFetcher";

export const dynamic = 'force-dynamic';

export default async function UsersListPage() {
    const data = await dataFetcher('/users');

    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">All Users ({data?.length})</h1>
            </div>
            <UsersListTable allUsers={data} />
        </>
    )
}