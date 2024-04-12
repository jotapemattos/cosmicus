'use server'

import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

interface SignUpProps {
  email: string
  password: string
}

export const signUp = async ({ email, password }: SignUpProps) => {
  const origin = headers().get('origin')
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  const emailAlreadyExists =
    data.user && data.user.identities && data.user.identities.length === 0

  if (emailAlreadyExists) {
    return redirect('/sign-up?message=Email já existente')
  }

  if (error) {
    console.log(error)
    return redirect('/sign-up?message=Could not authenticate user')
  }

  return redirect('/sign-up?message=Check email to continue sign in process')
}
