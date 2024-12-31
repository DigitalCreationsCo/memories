import { User as BaseUser } from "@supabase/supabase-js"

export type User = BaseUser & {
    password: string;
}

export type CreateUserInput = {
    email: string;
    password: string;
    name?: string;
}

export class UserError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'UserError'
    }
  }