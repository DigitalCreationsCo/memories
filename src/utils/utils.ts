import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as bcrypt from 'bcrypt-ts';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export const getAxiosError = (error: any): string => {
  if (error.response) {
    return error.response.data.error.message;
  }

  return error.message;
};