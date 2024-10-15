import { getProfiles } from '@/app/actions/profile'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import LevelBadge from '@/components/level-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Profile } from '@/db/custom-types'
import { getUserLevel } from '@/lib/get-user-level'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import UserPosition from '@/app/leaderboard/components/user-position'

export default function useGetProfilePosition() {
  const [ascending, setAscending] = useState(false)
  const [positions, setPositions] = useState<Record<string, number>>({})

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

  const columns: ColumnDef<Profile>[] = [
    {
      accessorKey: 'id',
      header: 'Posição',
      cell: (info) => {
        const profileId = info.getValue() as string

        return (
          <span className="font-medium">
            <UserPosition value={positions[profileId]} />
          </span>
        )
      },
    },
    {
      id: 'username', // Add this line
      header: 'Nome',
      accessorFn: (row) => row.username, // Change this line
      cell: ({ row }) => {
        // Change this to use row instead of getValue
        const username = row.getValue('username') as string
        const picture = row.original.picture
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={picture ?? undefined} />
              <AvatarFallback>
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{username}</span>
          </div>
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
      header: 'Level',
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
      header: '',
      cell: ({ row }) => {
        const userId = row.getValue('id')

        return (
          <Button asChild variant={'link'}>
            <Link href={`/profile/${userId}`}>Ver perfil</Link>
          </Button>
        )
      },
    },
  ]

  return { columns, profiles, ascending, setAscending, positions }
}
