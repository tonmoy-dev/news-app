
import AccountSettingsForm from "@/components/dashboard/account/AccountSettingsForm";
import { auth } from "@/utils/auth";
import { apiRequestHandler } from "@/utils/requestHandlers";

export const dynamic = 'force-dynamic';

export default async function AccountSettings() {
    const session = await auth();

    const userData = await apiRequestHandler('/users', { filter: [{ email: `${session?.user?.email}` }] });

    const user = userData?.[0]

    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">Account Settings</h1>
            </div>
            <AccountSettingsForm user={user} />
        </>
    )
}