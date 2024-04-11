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
      className="flex items-center gap-2 justify-center w-full mb-4 border-gray-800 border py-2 rounded-md hover:bg-white/10 transition-all duration-300"
      onClick={handleLoginWithGoogle}
    >
      <Google className="w-4 h-4" />
      <span>Entrar com Google</span>
    </button>
  )
}

export default GoogleAuthButton
