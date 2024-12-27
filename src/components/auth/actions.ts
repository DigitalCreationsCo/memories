"use server"

import { signIn, signOut } from "@/auth"
import { env } from "@/lib/env"

export async function getEnv() {
  return env;
}

export async function handleSignIn(provider?: string) {
  const redirectPath = env.REDIRECT_AFTER_SIGNIN
  await signIn(provider, {
    redirectTo: redirectPath,
  })
}

export async function handleSignOut() {
  await signOut()
}
