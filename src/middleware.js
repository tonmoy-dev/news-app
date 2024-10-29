import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { LOGIN_ROUTE, PUBLIC_ROUTES, ROOT_ROUTE } from "./lib/routes";
import { authConfig } from "./utils/auth.config";

const { auth } = NextAuth(authConfig);

export async function middleware(request) {
  // 
  const { nextUrl } = request;

  try {
    // Call the auth function with the correct request context
    const session = await auth();

    const isLoggedIn = !!session?.user;
    const isPublicRoute = PUBLIC_ROUTES.find(route => nextUrl.pathname.startsWith(route)) || nextUrl.pathname === ROOT_ROUTE;

    if (!isLoggedIn && !isPublicRoute) {
      return NextResponse.redirect(new URL(LOGIN_ROUTE, nextUrl));
    }

  } catch (error) {
    console.error("Error in middleware auth check:", error);
    return NextResponse.redirect(new URL(LOGIN_ROUTE, nextUrl));
  }
}


export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
