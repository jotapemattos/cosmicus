'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { ArrowDownWideNarrow, Search, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { User } from '@supabase/supabase-js'
import useGetProfilePosition from '@/hooks/use-get-profile-position'
import { DataTable } from './data-table'
import { useState } from 'react'

interface Search {
  search: string
}
interface LeaderboardProps {
  user: User
}

const Leaderboard = ({ user }: LeaderboardProps) => {
  // TODO - implementar a funcao des busca
  const { columns, profiles, ascending, positions, setAscending } =
    useGetProfilePosition()

  const [globalFilter, setGlobalFilter] = useState('')

  if (profiles === undefined) {
    return
  }

  const userPosition = positions[user.id] || null

  return (
    <section className="mx-auto flex max-w-screen-2xl flex-col items-end gap-4">
      <div className="mb-12 flex w-full items-center justify-between">
        {userPosition && (
          <p>
            Você está na posição <strong>#{userPosition}</strong> do ranking
          </p>
        )}
        <div className="flex items-center gap-4">
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              className="h-8 w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              placeholder="Buscar jogador"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            {globalFilter && (
              <Button
                size={'icon'}
                className="absolute right-2 top-2 size-4 rounded-full"
                type="button"
                variant="ghost"
                onClick={() => setGlobalFilter('')}
              >
                <span className="sr-only">Limpar busca</span>
                <X />
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 text-sm">
                <ArrowDownWideNarrow className="size-4" />
                <span>Ordenar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={ascending}
                onSelect={() => setAscending(true)}
              >
                Menor pontuação
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={!ascending}
                onSelect={() => setAscending(false)}
              >
                Maior pontuação
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DataTable columns={columns} data={profiles} />
    </section>
  )
}

export default Leaderboard
