'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

interface SignInProps {
  email: string
  password: string
}

export const signIn = async ({ email, password }: SignInProps) => {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error?.message.includes('Invalid login credentials')) {
    throw new Error('E-mail ou senha incorretos. Por favor, tente novamente.')
  }

  if (error) {
    throw new Error(
      '?message=Ops! Ocorreu um erro. Por favor, tente novamente mais tarde.',
    )
  }

  return redirect('/')
}
