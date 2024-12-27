"use client"

import Join from '@/components/auth/join';
import JoinWithInvitation from '@/components/auth/join-with-invitation';
import { AuthLayout } from '@/components/layouts';
import { getParsedCookie } from '@/lib/cookie';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Signup = () => {
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations('common');
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCookie() {
      const { token, url } = await getParsedCookie();
      setInviteToken(token);
      setNext(url);
    }
    fetchCookie();
  }, []);

  if (status === 'authenticated') {
    router.push('/');
  }

  return (
    <AuthLayout heading="Create an account">
    <>
      <div className="rounded-md bg-white p-6 shadow-sm">
        {inviteToken ? (
          <JoinWithInvitation inviteToken={inviteToken} next={next!} />
        ) : (
          <Join />
        )}
      </div>
    </>
    </AuthLayout>
  );
};

export default Signup;
