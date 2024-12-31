import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      try {
        let isLoggedIn = !!auth?.user;
        let isOnDashboard = nextUrl.pathname.startsWith('/home');

        if (isOnDashboard) {
          if (isLoggedIn) return true;
          return false;
        } else if (isLoggedIn) {
          return Response.redirect(new URL('/home', nextUrl));
        }

        return true;
      } catch (error) {
        console.error(`authorized error `, error)
        return false;
      }
    },
    async session({ session, user }) {
      try {
        return session;
      } catch (error) {
        console.error(`session error `, error)
        return session;
      }
    },
  },
} satisfies NextAuthConfig;
