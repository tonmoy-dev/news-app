import CredentialsLoginForm from "@/components/login/CredentialsLoginForm";
import LoginLayout from "@/components/login/LoginLayout";
import SocialsLoginForm from "@/components/login/SocialsLoginForm";
import fetchData from "@/utils/fetchData";

export const metadata = {
    title: "Login",
    description: "Login to your account",
};

export default async function LoginPage() {
    const siteSettings = await fetchData('/api/site-settings');
    const { footer_logo_img, logo_alt, site_name } = siteSettings[0];

    return (
        <>
            <LoginLayout siteName={site_name} footer_logo_img={footer_logo_img} logo_alt={logo_alt}>
                <CredentialsLoginForm />
                <SocialsLoginForm />
            </LoginLayout>
        </>
    )
}