import { createClient } from '@/utils/supabase/server'
import UserNav from './user-nav'
import Link from 'next/link'
import { Button } from './ui/button'
import UserLevel from './user-level'

export default async function Header() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="absolute top-0 flex w-full items-center justify-center border-b bg-background py-4">
      <nav className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4">
        <div className="flex items-center justify-between">
          <Link href={'/'}>Home</Link>
          <Button asChild variant={'ghost'}>
            <Link
              href="/completed-problems"
              className="bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline"
            >
              <span>Desafios</span>
            </Link>
          </Button>
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
        </div>
        {user ? (
          <div className="flex items-center justify-between gap-4">
            <UserLevel user={user} />
            <UserNav user={user} />
          </div>
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
