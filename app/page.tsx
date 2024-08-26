import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }
  return (
    <main className="min-h-screen w-screen space-y-10">
      <section className="mx-auto mt-36 max-w-screen-2xl space-y-4">
        <h1 className="text-4xl font-extrabold">Modulos</h1>
        <div className="flex w-full items-center justify-center gap-4">
          <Link
            href="/ct-problems"
            className="size-40 rounded-lg bg-zinc-400 p-4"
          >
            Pensamento Computacional
          </Link>
          <Link
            className="size-40 rounded-lg bg-zinc-400 p-4"
            href="/code-problems"
          >
            Algoritmos
          </Link>
        </div>
      </section>
    </main>
  )
}
