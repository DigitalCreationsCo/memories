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

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        let user = await getUser(email);
        if (!user) return null;
        let passwordsMatch = await verifyPassword(password, user.password!);
        if (passwordsMatch) return user as any;
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
      const signingSecret = process.env.AUTH_SECRET;
      if (signingSecret) {
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
      }
      return session;
    },
  },
});