"use server";

import { signIn, signOut } from "@/utils/auth";

export async function doSocialLogin(formData) {
    const action = formData.get('action');
    await signIn(action, { redirectTo: "/dashboard" });
}

export async function doLogout() {
    await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin(formData) {
    // 

    try {
        const response = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (!response) {
            // Return response error message instead of throwing an error
            return { error: response?.error || "Login failed" };
        }
        return response;

    } catch (err) {
        // Log and re-throw or return error for frontend handling
        console.error("Error during login:", err);
        return { error: err.message || "An unknown error occurred" };
    }
}
