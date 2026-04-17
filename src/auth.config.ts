import type { NextAuthConfig } from "next-auth";

const authConfig = {
  pages: {
    signIn: "/login"
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = Boolean(session?.user);
      const pathname = request.nextUrl.pathname;
      const isProtected =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/tasks") ||
        pathname.startsWith("/settings");
      const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

      if (isProtected) {
        return isLoggedIn;
      }

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }

      return true;
    }
  },
  providers: []
} satisfies NextAuthConfig;

export default authConfig;
