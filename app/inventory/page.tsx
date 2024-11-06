import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Inventory from './inventory'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PerksInventory from './perks-inventory'

const Page = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }
  return (
    <main className="min-h-screen w-full space-y-24 p-4 py-32 lg:px-0">
      <section className="mx-auto mt-12 flex-col space-y-4 md:max-w-screen-md md:flex-row lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <h1 className="text-4xl font-extrabold">Inventário</h1>
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
          <p className="text-muted-foreground">
            Aqui estão os itens atualmente disponíveis no seu{' '}
            <strong className="text-white">inventário</strong>.
          </p>
          <Button asChild variant={'secondary'} className="w-full md:w-fit">
            <Link href="/shop">Adquira itens na loja</Link>
          </Button>
        </div>
      </section>
      <Inventory user={user} />
      <PerksInventory user={user} />
    </main>
  )
}

export default Page
