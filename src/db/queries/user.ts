import supabase from "../client"
import { User as BaseUser } from "@supabase/supabase-js"

export type User = BaseUser & {
    password: string;
}

export type CreateUserInput = {
    email: string;
    password: string;
    name?: string;
}

export async function getUser(userId: string): Promise<User> {
  try {
    const client = await supabase()
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

export async function createUser({ email, password, ...userData }: CreateUserInput): Promise<User> {
  try {
    const client = await supabase()
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
    const client = await supabase()
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
    const client = await supabase()
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

export default supabase


export class UserError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'UserError'
    }
  }
  