'use client'
import { createClient } from '@/utils/supabase/client'
import Github from './icons/github'

const GithubAuthButton = () => {
  const supabase = createClient()

  const handleLoginWithGithub = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button
      className="flex w-auto items-center justify-center gap-2 rounded-md border-2 border-gray-700 px-4 py-2 text-sm font-medium transition-all duration-300 hover:brightness-75"
      onClick={handleLoginWithGithub}
    >
      <Github className="h-4 w-4" />
      <span>Entrar com Github</span>
    </button>
  )
}

export default GithubAuthButton
