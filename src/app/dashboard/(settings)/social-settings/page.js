import SocialLinksManager from "@/components/dashboard/settings/SocialLinksManager";
import fetchData from "@/utils/fetchData";

export const dynamic = 'force-dynamic';

export default async function SocialSettingsPage() {
    const socials = await fetchData('/api/site-settings/socials');

    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">Social Settings</h1>
            </div>
            <SocialLinksManager socialsData={socials} />
        </>
    )
}