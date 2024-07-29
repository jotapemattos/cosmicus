'use client'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { getProfileByUserId } from '@/app/actions/profile'
import { signOut } from '@/app/actions/sign-out'

interface UserNavProps {
  user: User
}
export default function UserNav({ user }: UserNavProps) {
  const { data: profile } = useQuery({
    queryKey: ['profile', user.id],
    queryFn: () => getProfileByUserId({ profileId: user.id }),
  })
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
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/profile/${user.id}`}>Meu Perfil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/inventory">Inventário</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <form action={signOut} className="w-full">
            <button className="w-full text-start" type="submit">
              Sair
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
