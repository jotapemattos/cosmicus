'use client'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  LogOut,
  Medal,
  Shirt,
  Store,
  Sword,
  User as UserIcon,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { signOut } from '@/app/actions/sign-out'
import { User } from '@supabase/supabase-js'

interface CommandMenuProps {
  user: User | null
}

export function CommandMenu({ user }: CommandMenuProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="ml-auto">
      <Button
        className="group h-8 text-sm text-muted-foreground"
        variant={'secondary'}
        onClick={() => setOpen(!open)}
      >
        Pressione{' '}
        <kbd className="pointer-events-none ml-4 inline-flex select-none items-center gap-1 rounded border bg-white/10 px-1.5 font-mono text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:bg-white/5">
          <span className="text-sm">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite um comando para buscá-lo..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado foi encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação Principal">
            <CommandItem asChild className="hover:cursor-pointer">
              <Link href="/" onClick={() => setOpen(!open)}>
                {/* <House /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-house"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                Página Inicial
              </Link>
            </CommandItem>
            <CommandItem asChild className="hover:cursor-pointer">
              <Link href="/completed-problems" onClick={() => setOpen(!open)}>
                <Sword />
                Desafios
              </Link>
            </CommandItem>
            <CommandItem asChild className="hover:cursor-pointer">
              <Link href="/leaderboard" onClick={() => setOpen(!open)}>
                <Medal />
                Ranking
              </Link>
            </CommandItem>
            <CommandItem asChild className="hover:cursor-pointer">
              <Link href="/shop" onClick={() => setOpen(!open)}>
                <Store />
                Loja
              </Link>
            </CommandItem>
          </CommandGroup>
          {user && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Área do Usuário">
                <CommandItem asChild className="hover:cursor-pointer">
                  <Link
                    href={`/profile/${user.id}`}
                    onClick={() => setOpen(!open)}
                  >
                    <UserIcon />
                    Meu Perfil
                  </Link>
                </CommandItem>
                <CommandItem asChild className="hover:cursor-pointer">
                  <Link href="/inventory" onClick={() => setOpen(!open)}>
                    <Shirt />
                    Inventário
                  </Link>
                </CommandItem>
                <CommandItem asChild className="p-0 hover:cursor-pointer">
                  <form action={signOut} className="w-full p-0">
                    <button
                      className="flex h-full w-full items-center gap-2 text-start"
                      type="submit"
                    >
                      <LogOut />
                      Sair
                    </button>
                  </form>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  )
}
