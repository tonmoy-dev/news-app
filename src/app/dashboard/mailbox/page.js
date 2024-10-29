import MailboxTable from "@/components/dashboard/mailbox/MailboxTable";
import fetchData from "@/utils/fetchData";

export const dynamic = 'force-dynamic';

export default async function MailBoxPage() {

    const data = await fetchData('/api/inbox');

    return (
        <> <div className="mx-auto max-w-7xl mb-4">
            <h1 className="text-xl font-medium text-gray-900">Mails ({data?.length})</h1>
        </div>
            <MailboxTable messages={data} />
        </>
    )
}