"use server"

import { cookies } from 'next/headers'

export async function getParsedCookie(): Promise<{
  token: string | null;
  url: string | null;
}> {
  const cookieStore = cookies()
  const cookie = cookieStore.get('pending-invite')

  return cookie
    ? JSON.parse(cookie.value)
    : {
        token: null,
        url: null,
      };
}
