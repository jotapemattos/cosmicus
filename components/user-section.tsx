import { Link } from 'lucide-react'
import UserLevel from './user-level'
import UserNav from './user-nav'
import { createClient } from '@/utils/supabase/server'

const UserSection = async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user ? (
    <div className="flex flex-col items-center gap-4 sm:flex-row md:items-center">
      <UserLevel user={user} />
      <UserNav user={user} />
    </div>
  ) : (
    <Link
      href="/login"
      className="bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline"
    >
      Entrar
    </Link>
  )
}

export default UserSection
