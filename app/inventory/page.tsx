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
    return redirect('/sign-in')
  }
  return (
    <main className="min-h-screen w-full space-y-24 py-32">
      <section className="mx-auto mt-12 max-w-screen-2xl space-y-4">
        <h1 className="text-4xl font-extrabold">Inventário</h1>
        <div className="flex w-full items-center justify-between">
          <p>
            Estes são os itens que você possui no seu{' '}
            <strong>inventário</strong>.
          </p>
          <Button asChild variant={'secondary'}>
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
