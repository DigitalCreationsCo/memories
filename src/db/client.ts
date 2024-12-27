import { auth } from "@/auth"
import { createClient } from "@supabase/supabase-js"

const supabase = async () => {
  const session = await auth()
  const { supabaseAccessToken } = session || {}
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  )
}

export default supabase