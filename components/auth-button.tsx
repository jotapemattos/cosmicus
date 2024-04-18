import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getProfileByUserId } from '@/data/profile'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function AuthButton() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/sign-in')
  }

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline"
      >
        Entrar
      </Link>
    )
  }

  const profile = await getProfileByUserId({ userId: user.id })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={profile?.picture ?? undefined} />
          <AvatarFallback>
            {profile?.username?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <form action={signOut} className="w-full">
            <button>Sair</button>
          </form>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/profile/${user.id}`}> Meu Perfil</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
