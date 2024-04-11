'use server'

import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const signUp = async (formData: FormData) => {
  'use server'

  const origin = headers().get('origin')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return redirect('/sign-up?message=Could not authenticate user')
  }

  return redirect('/sign-up?message=Check email to continue sign in process')
}
