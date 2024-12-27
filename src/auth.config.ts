import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      let isOnDashboard = nextUrl.pathname.startsWith('/home');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/home', nextUrl));
      }

      return true;
    },
    async session({ session, user }) {
      return session;
    },
  },
} satisfies NextAuthConfig;

// import type { NextAuthConfig } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"

// export default {
//   providers: [CredentialsProvider({
//     name: "Credentials",
//     credentials: {
//       username: { label: "Email", type: "text" },
//       password: { label: "Password", type: "password" }
//     },
//     async authorize(credentials) {
//       // This is where you would validate the credentials
//       // For testing purposes, we'll accept any credentials
//       if (credentials?.username && credentials?.password) {
//         return {
//           id: "1",
//           name: credentials.username,
//           email: `${credentials.username}@example.com`
//         } as any
//       }
//       return null
//     }
//   })],
//   basePath:"/auth",
//   pages: {
//     signIn: '/signin',
//     signOut: '/signout',
//     error: '/error',
//     verifyRequest: '/verify-request',
//     newUser: '/new-user'
//   },
//   debug: process.env.NODE_ENV !== 'production',
//   callbacks: {
//       authorized:({ auth }) => !!auth,
//       jwt({ token, trigger, session, account }) {
//         if (trigger === "update") token.name = session.user.name
//         return token
//       },
//       async session({ session, token }) {
//         return session
//       },
//     },
//  } satisfies NextAuthConfig
