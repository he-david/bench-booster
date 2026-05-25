import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: { role: Role } & import("next-auth").DefaultSession["user"];
  }
  interface User {
    role: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: Role;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      if (!isLoggedIn) return false;
      if (
        request.nextUrl.pathname.startsWith("/admin") &&
        auth?.user?.role !== "ADMIN"
      ) {
        return Response.redirect(new URL("/questions", request.url));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) token.role = (user as { role: Role }).role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as Role;
      return session;
    },
  },
};
