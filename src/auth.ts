import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import * as jose from 'jose';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { getUser } from '@/db/queries/user';
import Credentials from 'next-auth/providers/credentials';
import * as bcrypt from 'bcrypt-ts';

async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize({ email, password }: any) {
        try {
          let user = await getUser(email);
          if (!user) {
            throw new Error('No user found with this email');
          }
          
          let passwordsMatch = await verifyPassword(password, user.password!);
          if (!passwordsMatch) {
            throw new Error('Invalid password');
          }
          
          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }),
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user }) {
      try {
        console.debug(`session callback `, session, user)
        const signingSecret = process.env.AUTH_SECRET;
        if (!signingSecret) {
          console.error('Missing AUTH_SECRET environment variable');
          throw new Error('Missing AUTH_SECRET');
        }

        if (!user?.id || !user?.email) {
          console.error('Missing user data in session callback:', user);
          throw new Error('Invalid user data');
        }

        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        };
        
        const secret = new TextEncoder().encode(signingSecret);
        session.supabaseAccessToken = await new jose.SignJWT(payload)
          .setProtectedHeader({ alg: 'HS256' })
          .sign(secret);
        console.debug(`session.supabaseAccessToken `, session.supabaseAccessToken)

        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session; // Return session without Supabase token if there's an error
      }
    },
  },
});