import { createClient } from '@/utils/supabase/server'
import UserNav from './user-nav'
import Link from 'next/link'
import { Button } from './ui/button'

export default async function Header() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="absolute top-0 flex w-full items-center justify-center border-b bg-background py-4">
      <nav className="mx-auto flex w-full max-w-screen-2xl items-center justify-end gap-4">
        <Button asChild variant={'ghost'}>
          <Link
            href="/leaderboard"
            className="bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline"
          >
            <span>Ranking</span>
          </Link>
        </Button>
        <Button asChild variant={'ghost'}>
          <Link
            href="/shop"
            className="bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline"
          >
            <span>Loja</span>
          </Link>
        </Button>
        {user ? (
          <UserNav user={user} />
        ) : (
          <Link
            href="/sign-in"
            className="bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline"
          >
            Entrar
          </Link>
        )}
      </nav>
    </header>
  )
}
