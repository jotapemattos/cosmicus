import { createClient } from '@/utils/supabase/server'
import UserNav from './user-nav'
import Link from 'next/link'

export default async function Header() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="absolute top-0 flex w-full items-center justify-center border-b bg-background py-4">
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
    </header>
  )
}
