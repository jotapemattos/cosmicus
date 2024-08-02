'use client'

import LevelBadge from '@/components/level-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Profile } from '@/db/custom-types'
import { getUserLevel } from '@/lib/get-user-level'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const columns: ColumnDef<Profile>[] = [
  {
    accessorKey: 'id',
    header: 'Posição',
    cell: ({ row }) => {
      const profileId = parseInt(row.getValue('id'))

      return <span className="font-medium">{positions[profileId]}</span>
    },
  },
  {
    accessorKey: 'username',
    header: 'Nome',
    cell: (info) => {
      const userName = info.getValue() as string
      return (
        <>
          <Avatar className="group size-8">
            <AvatarImage src={profile?.picture ?? undefined} />
            <AvatarFallback>
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{userName}</span>
        </>
      )
    },
  },
  {
    accessorKey: 'experience_points',
    header: 'Pontos de Experiência',
    cell: ({ row }) => {
      const profileXp = parseInt(row.getValue('experience_points'))
      return <span>{profileXp}</span>
    },
  },
  {
    accessorKey: 'experience_points',
    cell: ({ row }) => {
      const profileXp = parseInt(row.getValue('experience_points'))
      const { level } = getUserLevel({
        experiencePoints: profileXp,
      })

      return <LevelBadge userLevel={level} />
    },
  },
  {
    accessorKey: 'id',
    cell: ({ row }) => {
      const userId = parseInt(row.getValue('id'))

      return (
        <Button asChild variant={'link'}>
          <Link href={`/profile/${userId}`}>Ver perfil</Link>
        </Button>
      )
    },
  },
]
