'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getProfiles } from '@/app/actions/profile'
import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
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
import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

import { User } from '@supabase/supabase-js'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { getUserLevel } from '@/lib/get-user-level'
import LevelBadge from '@/components/level-badge'

interface LeaderboardProps {
  user: User
}

interface Search {
  search: string
}

const Leaderboard = ({ user }: LeaderboardProps) => {
  const searchParams = useSearchParams()

  const router = useRouter()

  const pathname = usePathname()

  const [ascending, setAscending] = useState(false)
  const [positions, setPositions] = useState<Record<string, number>>({})

  const { register, handleSubmit, reset } = useForm<{ search: string }>()

  const { data: profiles } = useQuery({
    queryKey: ['profiles', ascending],
    queryFn: () => getProfiles({ ascending }),
  })

  // keep tracking of the position of each profile (couldn't use index because of the sorting feature)
  useEffect(() => {
    if (profiles) {
      const sortedProfiles = [...profiles].sort(
        (a, b) => b.experience_points - a.experience_points,
      )
      const updatedPositions = sortedProfiles.reduce(
        (acc, profile, index) => {
          acc[profile.id] = index + 1
          return acc
        },
        {} as Record<string, number>,
      )
      setPositions(updatedPositions)
    }
  }, [profiles, ascending])

  if (profiles === undefined) {
    return
  }

  const handleSearch: SubmitHandler<Search> = (data) => {
    const searchQuery = data.search

    router.push(`/leaderboard?search=${searchQuery}&page=1`)
  }

  const handleSearchClear = () => {
    reset({ search: '' })

    router.push(`/leaderboard`)
  }

  const search = searchParams.get('search')
    ? String(searchParams.get('search'))
    : ''

  const pageRange = 3

  const totalPages = Math.ceil(profiles.length / pageRange)

  const currentPage = Number(searchParams.get('page')) || 1

  const shouldShowFirstPage = currentPage > 9

  const shouldShowLastPage = profiles.length - currentPage > 9

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
          <form
            className="relative ml-auto flex-1 md:grow-0"
            onSubmit={handleSubmit(handleSearch)}
          >
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              className="h-8 w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              placeholder="Buscar jogador"
              {...register('search')}
            />
            <Button
              size={'icon'}
              className="absolute right-2 top-2 size-4 rounded-full"
              onClick={handleSearchClear}
              type="button"
              variant="ghost"
            >
              <span className="sr-only">Limpar busca</span>
              <X />
            </Button>
          </form>
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Posição</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Pontos de Experiência</TableHead>
            <TableHead>Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles
            .filter((profile) =>
              profile.username?.toLowerCase().includes(search?.toLowerCase()),
            )
            .slice((currentPage - 1) * pageRange, currentPage * pageRange)
            .map((profile) => {
              const { level } = getUserLevel({
                experiencePoints: profile.experience_points as number,
              })
              return (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    {positions[profile.id]}
                  </TableCell>
                  <TableCell className="flex w-1/2 items-center gap-4">
                    <Avatar className="group size-8">
                      <AvatarImage src={profile?.picture ?? undefined} />
                      <AvatarFallback>
                        {profile?.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {profile.username}
                  </TableCell>
                  <TableCell>{profile.experience_points}</TableCell>
                  <TableCell>
                    <LevelBadge userLevel={level} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant={'link'}>
                      <Link href={`/profile/${profile.id}`}>Ver perfil</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={{
                pathname,
                query: { page: currentPage === 1 ? 1 : currentPage - 1 },
              }}
              scroll={false}
            />
          </PaginationItem>
          {shouldShowFirstPage && (
            <>
              <PaginationItem>
                <PaginationLink
                  href={{
                    pathname,
                    query: { page: 1 },
                  }}
                  scroll={false}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}
          {[...Array(profiles)].map((_, index) => {
            const pageNumber = index + 1

            const pageDifference = Math.abs(pageNumber - currentPage)

            const shouldShowPage = pageDifference < 3

            if (shouldShowPage) {
              return (
                <PaginationItem
                  key={index}
                  className={cn({
                    'hidden lg:flex': pageDifference > 0,
                  })}
                >
                  <PaginationLink
                    href={{
                      pathname,
                      query: { page: pageNumber },
                    }}
                    isActive={pageNumber === currentPage}
                    scroll={false}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            }
            return null
          })}
          {shouldShowLastPage && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href={{
                    pathname,
                    query: { page: profiles.length },
                  }}
                  scroll={false}
                >
                  {profiles.length}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationNext
              href={{
                pathname,
                query: {
                  page:
                    currentPage >= totalPages ? totalPages : currentPage + 1,
                },
              }}
              scroll={false}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  )
}

export default Leaderboard
