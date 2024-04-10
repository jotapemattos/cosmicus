'use client'
import { createClient } from "@/utils/supabase/client";
import Github from "./icons/github"


const GithubAuthButton = () => {

  const supabase = createClient()
  
  const handleLoginWithGithub = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
  }

  return (
      <button className="flex items-center gap-2 justify-center w-full mb-4 border-gray-800 border py-2 rounded-md hover:bg-white/10 transition-all duration-300" onClick={handleLoginWithGithub}>
          <Github className="w-4 h-4"/>
          <span>Entrar com Github</span>
      </button>
  )
}

export default GithubAuthButton