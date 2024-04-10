import { redirect } from "next/navigation";
import Github from "./icons/github"
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";


const GithubAuthButton = () => {

  const origin = headers().get("origin");

  const signInWithGithub = async () => {
    "use server";
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${origin}/auth/callback`,
      }
    })
    
    if (error) {
      return redirect("/sign-in?message=Could not authenticate user");
    }
    return redirect(data.url);
  };

  return (
    <form>
      <button className="flex items-center gap-2 justify-center w-full mb-4 border-gray-800 border py-2 rounded-md hover:bg-white/10 transition-all duration-300" formAction={signInWithGithub}>
          <Github className="w-4 h-4"/>
          <span>Entrar com Github</span>
      </button>
    </form>
  )
}

export default GithubAuthButton