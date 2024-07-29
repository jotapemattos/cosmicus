import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Problems from '../components/problems'

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
        <h1 className="text-4xl font-extrabold">Desafios</h1>
        <Problems />
      </section>
    </main>
  )
}
