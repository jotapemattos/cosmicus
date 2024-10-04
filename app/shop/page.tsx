import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SkinsShop from './skins-shop'
import PerksShop from './perks-shop'
import Shop from '@/components/icons/shop'

export default async function Page() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }
  return (
    <main className="h-full w-full space-y-10 py-32">
      <div className="mx-auto mt-12 flex max-w-screen-2xl items-center gap-4">
        <Shop />
        <h1 className="text-4xl font-extrabold">Loja</h1>
      </div>
      <SkinsShop user={user} />
      <PerksShop user={user} />
    </main>
  )
}
