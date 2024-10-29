import AllSettings from "@/components/dashboard/settings/AllSettings";
import FooterSettings from "@/components/dashboard/settings/FooterSettings";
import GeneralSettings from "@/components/dashboard/settings/GeneralSettings";
import OtherSettings from "@/components/dashboard/settings/OtherSettings";

export const dynamic = 'force-dynamic';

export default function SiteSettingsPage() {
    return (
        <>
            <div className="mx-auto text-left mb-4" >
                <h1 className="text-xl font-medium text-gray-900">Site Settings</h1>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: "800px" }}>
                <GeneralSettings />
                {/* <OtherSettings /> */}
                <AllSettings />
                <FooterSettings />
            </div>
        </>
    )
} 