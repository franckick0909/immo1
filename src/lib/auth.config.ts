import type { NextAuthConfig } from 'next-auth';
import { NextURL } from 'next/dist/server/web/next-url';
import { Session } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: { auth: Session | null; request: { nextUrl: NextURL } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
  providers: [],
};