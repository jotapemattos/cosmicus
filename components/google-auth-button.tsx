'use client'
import { createClient } from '@/utils/supabase/client'
import Google from './icons/google'

const GoogleAuthButton = () => {
  const supabase = createClient()

  const handleLoginWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button
      className="flex items-center justify-center gap-2 rounded-md border-2 border-gray-400 bg-gradient-to-b from-indigo-400 to-indigo-600 px-4 py-2 text-sm font-medium text-zinc-950 transition-all duration-200 hover:brightness-75"
      onClick={handleLoginWithGoogle}
    >
      <Google className="h-4 w-4" />
      <span>Entrar com Google</span>
    </button>
  )
}

export default GoogleAuthButton
