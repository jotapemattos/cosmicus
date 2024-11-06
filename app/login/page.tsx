import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { FlickeringGrid } from '@/components/magic-ui/flickering-grid'
import GoogleAuthButton from '@/components/google-auth-button'
import GithubAuthButton from '@/components/github-auth-button'

const Page = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/')
  }
  return (
    <main className="relative flex min-h-screen w-full max-w-xl flex-col items-center justify-center">
      <div>
        <div className="absolute bottom-80 left-20 -z-10 h-12 w-32 rounded-full bg-indigo-500/70 blur-3xl"></div>
      </div>
      <div className="w-full rounded-2xl bg-black/20 p-1 backdrop-blur-md">
        <div className="flex w-full flex-col items-center justify-center rounded-xl border border-border px-6 py-14">
          <div className="relative flex h-[150px] w-[500px] items-center justify-center overflow-hidden">
            <FlickeringGrid
              className="absolute [mask:radial-gradient(circle_at_center,#fff_300px,transparent_0)]"
              squareSize={3}
              gridGap={8}
              color="#60A5FA"
              maxOpacity={0.5}
              flickerChance={0.1}
              height={150}
              width={520}
            />
            <Image
              src="/logo.png"
              alt="Imagem de logo"
              width={1024}
              height={1024}
              className="absolute aspect-square size-28 object-contain"
            />
          </div>
          <h1 className="text-3xl font-semibold tracking-wide text-zinc-50">
            Faça login na <em className="text-indigo-300">Cosmicus</em>
          </h1>
          <div className="mt-10 flex w-full max-w-sm flex-col gap-4">
            <GoogleAuthButton />
            <GithubAuthButton />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page
