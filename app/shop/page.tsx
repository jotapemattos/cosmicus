import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Shop from './shop'

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
        <h1 className="text-4xl font-extrabold">Loja</h1>
        <p>
          Utilize suas <strong>moedas</strong> para resgatar itens na loja
        </p>
      </section>
      <Shop user={user} />
    </main>
  )
}
