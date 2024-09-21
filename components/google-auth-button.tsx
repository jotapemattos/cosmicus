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
      className="flex items-center justify-center gap-2 rounded-md border border-gray-800 px-4 py-2 text-sm transition-all duration-300 hover:bg-white/10"
      onClick={handleLoginWithGoogle}
    >
      <Google className="h-4 w-4" />
      <span>Entrar com Google</span>
    </button>
  )
}

export default GoogleAuthButton
