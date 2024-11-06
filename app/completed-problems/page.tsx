import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CompletedProblems from './completed-problems'

export default async function Page() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <main className="min-h-screen w-screen space-y-10 p-4 md:p-0">
      <section className="mx-auto mt-36 space-y-4 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <h1 className="text-4xl font-extrabold">Desafios concluídos</h1>
        <p className="text-muted-foreground">
          Confira os desafios que você já completou e refaça-os se desejar.
        </p>
      </section>
      <CompletedProblems userId={user.id} />
    </main>
  )
}
