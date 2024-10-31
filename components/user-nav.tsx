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
import { LogOut, UserIcon } from 'lucide-react'

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
          <Link href={`/profile/${user.id}`}>
            <UserIcon size={18} />
            <span className="ml-2">Meu Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/inventory">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chest"
            >
              <path d="M8 19a2 2 0 0 0 2-2V9a4 4 0 0 0-8 0v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a4 4 0 0 0-4-4H6" />
              <path d="M2 11h20" />
              <path d="M16 11v3" />
            </svg>
            <span className="ml-2">Inventário</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <form action={signOut} className="w-full">
            <button
              className="flex w-full items-center gap-2 text-start"
              type="submit"
            >
              <LogOut size={18} />
              Sair
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
