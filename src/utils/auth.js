import bcrypt from 'bcryptjs';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { apiRequestHandler, axiosRequestHandler } from "./requestHandlers";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        // google provider for sign in with google
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        CredentialsProvider({
            credentials: {
                email: {},
                password: {}
                // email: "dev@gmail.com",
                // password: 123456,
            },
            async authorize(credentials) {
                // 

                if (credentials === null) return null;

                // Check if credentials are provided
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }
                try {
                    // Find the user by email
                    const user = await getUserByEmail(credentials?.email);
                    // 
                    if (!user) {
                        // return null;
                        throw new Error("User not found");
                    }
                    // Check if the password matches
                    // const isMatch = user?.password === credentials.password;
                    const isMatch = await bcrypt.compare(credentials.password, user?.password);

                    if (!isMatch) {
                        // return null;
                        throw new Error("Invalid password");
                    }
                    return user;
                    // return {
                    //     id: user.id,
                    //     name: user.full_name,
                    //     email: user.email,
                    // };
                } catch (error) {
                    console.error("Error in credentials sign-in:", error.message);
                    // return null;
                    throw new Error(error.message || "Credentials authentication failed");

                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // 

            const { name, email, image } = user;
            // 

            // Check if the email exists in the users table
            const data = await getUserByEmail(email);

            if (data?.email) {
                if (data?.status === "blocked") {

                    // return false;
                    // return "/login";
                    return "/login?error=blocked";
                } else {
                    // toast.success('Successfully logged in!');
                    return true;
                }
            } else {
                const isUserCreated = await createNewUser(name, email, image);
                if (isUserCreated) {


                    // toast.success('Successfully logged in!');
                    return true; // Allow sign-in
                } else {

                    return "/login?error=creation_failed";
                    // return false; // Redirect to login on failure
                }
            }
        },
        // Modify session object here
        async session({ session, token }) {

            // Only fetch additional user data if it's not already set
            if (!session.user.id || !session.user.role || !session.user.status) {
                const superAdminEmail = "superadmin@superadmin.com";

                // Fetch additional data for the user
                const userData = await apiRequestHandler('/users', {
                    filter: [
                        { email: `${session.user.email}` }
                    ]
                });
                if (userData?.[0]) {
                    // Modify the session object with custom data
                    session.user.id = userData?.[0]?.id;
                    session.user.role = userData?.[0]?.role;
                    session.user.status = userData?.[0]?.status;

                    if (!session.user.name) {
                        session.user.name = userData?.[0]?.full_name;
                    }

                    // Check if the user is a super admin based on their email
                    if (session.user.email === superAdminEmail) {
                        session.user.isSuperAdmin = true;
                        // session.user.status = 'super_admin';  // Add the super admin status
                    }
                    // 
                } else {
                    console.error('User data not found for email:', session.user.email);
                }
            } else {

            }
            return session;
        },
        async signOut({ token }) {
            // Perform any cleanup actions or logging if needed.
            // Optional: You can also log or send a message to the user after logout.
        }
    },
    // pages: {
    //     // Custom login page if needed
    //     signIn: '/login',
    // },
    // debug: false,
    // trustHost: true
    // providers: [ ... ]
});


async function getUserByEmail(email) {
    const userData = await apiRequestHandler('/users', {
        filter: [
            { email: `${email}` }
        ]
    });

    if (userData?.[0]) {
        const data = {
            email: userData?.[0]?.email,
            status: userData?.[0]?.status,
            role: userData?.[0]?.role,
            password: userData?.[0]?.hashed_password,
        }
        // 

        return data;
    } else {
        return null;
    }
}

async function createNewUser(name, email, image) {


    try {
        const response = await axiosRequestHandler('/users', {}, {
            method: 'POST',
            body: {
                data: {
                    full_name: name,
                    email: email,
                    profile_image_url: image
                },
            },
        });
        if (response) {

            return true;
        }
    } catch (error) {
        console.error('Error creating user:', error.message);
        return false;
    }
}


export async function verifyPassword(plainPassword, hashedPassword) {
    return;
    // return await bcrypt.compare(plainPassword, hashedPassword);
}



// const superAdminEmails = ["superadmin1@example.com", "superadmin2@example.com"];
// // Check if the email belongs to one of the super admins
// if (superAdminEmails.includes(session.user.email)) {
//     session.user.status = 'super admin';  // Add the super admin status
// }
