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
    <main className="h-full w-full space-y-10 px-4 py-32 md:px-0">
      <div className="mx-auto mt-12 flex items-center gap-4 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <Shop />
        <h1 className="text-4xl font-extrabold">Loja</h1>
      </div>
      <div className="space-y-32">
        <SkinsShop user={user} />
        <PerksShop user={user} />
      </div>
    </main>
  )
}
