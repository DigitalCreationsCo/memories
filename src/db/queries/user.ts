"use server"

import { createAnonClient } from "../client"
import { User, CreateUserInput, UserError } from "@/types/user.types"

export async function getUser(userId: string): Promise<User> {
  try {
    const client = await createAnonClient()
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw new UserError(error.message)
    if (!data) throw new UserError('User not found')

    return data
  } catch (error) {
    if (error instanceof UserError) throw error
    throw new UserError('Failed to fetch user')
  }
}

export async function getUserByEmail(email: string): Promise<User> {
  const client = createAnonClient()
  const { data, error } = await client.from('users').select('*').eq('email', email).single()
  if (error) throw new UserError(error.message)
  if (!data) throw new UserError('User not found')
  return data
}

export async function createUser({ email, password, ...userData }: CreateUserInput): Promise<User> {
  try {
    const client = await createAnonClient()
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: userData  // Additional user metadata
      }
    })

    if (error) throw new UserError(error.message)
    if (!data.user) throw new UserError('Failed to create user')

    return data.user as any
  } catch (error) {
    if (error instanceof UserError) throw error
    throw new UserError('Failed to create user')
  }
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<User> {
  try {
    const client = await createAnonClient()
    const { data, error } = await client
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw new UserError(error.message)
    if (!data) throw new UserError('User not found')

    return data
  } catch (error) {
    if (error instanceof UserError) throw error
    throw new UserError('Failed to update user')
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    const client = await createAnonClient()
    const { error } = await client
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw new UserError(error.message)
  } catch (error) {
    if (error instanceof UserError) throw error
    throw new UserError('Failed to delete user')
  }
}
