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
import { ArrowDownWideNarrow } from 'lucide-react'

import { User } from '@supabase/supabase-js'
import useGetProfilePosition from '@/hooks/use-get-profile-position'
import { DataTable } from './data-table'
import { Skeleton } from '@/components/ui/skeleton'

interface LeaderboardProps {
  user: User
}

const LeaderboardSkeleton = () => (
  <section className="mx-auto flex flex-col items-end gap-4 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
    <div className="w-full space-y-8">
      {/* Placeholder for search and filters */}
      <div className="flex w-full flex-col justify-between gap-8 md:flex-row md:items-center">
        <Skeleton className="h-6 w-48" />
        <div className="flex w-full flex-col gap-4 md:w-fit md:flex-row md:items-center">
          <Skeleton className="h-8 w-[336px]" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Placeholder for table */}
      <div className="w-full rounded-md border">
        <div className="grid grid-cols-5 gap-4 p-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-5 items-center gap-4 p-4"
            >
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="col-span-2 h-6 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder for pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  </section>
)

const Leaderboard = ({ user }: LeaderboardProps) => {
  // TODO - implementar a funcao des busca
  const { columns, profiles, ascending, positions, setAscending } =
    useGetProfilePosition()

  if (profiles === undefined) {
    return <LeaderboardSkeleton />
  }

  const userPosition = positions[user.id] || null

  return (
    <section className="mx-auto flex flex-col items-end gap-4 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
      <DataTable
        columns={columns}
        data={profiles}
        userPosition={userPosition as number}
      >
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
      </DataTable>
    </section>
  )
}

export default Leaderboard
