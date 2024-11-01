'use client'

import { getProfileByUserId, getProfiles } from '@/app/actions/profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { notFound } from 'next/navigation'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import EditProfileDialog from './edit-profile-dialog'
import DeleteProfileDialog from './delete-profile-dialog'
import { Button } from '@/components/ui/button'
import ChangeProfilePicDialog from './change-profile-pic-dialog'
import { getUserLevel } from '@/lib/get-user-level'
import LevelBadge from '@/components/level-badge'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { BentoGrid, BentoGridItem } from '@/components/magic-ui/bento-grid'
import { cn } from '@/lib/utils'
import { getUserTotalCtSubmissions } from '@/app/actions/ct-fundamentals-submission'
import { getUserTotalSubmissions } from '@/app/actions/submissions'
import getLeaderboardWindow from '@/lib/get-leaderboard-window'
import { Profile as ProfileType } from '@/db/custom-types'
import UserPosition from '@/app/leaderboard/components/user-position'
import { ChevronsRight } from 'lucide-react'

interface ProfileProps {
  profileId: string
  currentUserId: string
}

const ProfileSkeleton = () => {
  const items = [
    { className: 'md:col-span-1' },
    { className: 'md:col-span-2' },
    { className: 'md:col-span-2' },
    { className: 'md:col-span-1' },
    { className: 'md:col-span-1' },
    { className: 'md:col-span-1' },
    { className: 'md:col-span-1' },
  ]

  return (
    <main className="min-h-screen w-full overflow-x-hidden p-4">
      <section className="relative mx-auto my-24 w-full space-y-8 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex w-full flex-col items-center gap-8">
          <Skeleton className="h-48 w-48 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <BentoGrid className="mx-auto max-w-4xl">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              className={cn('border bg-accent', item.className)}
              header={<Skeleton className="h-full w-full" />}
            />
          ))}
        </BentoGrid>
      </section>
    </main>
  )
}

const Profile = ({ profileId, currentUserId }: ProfileProps) => {
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => getProfileByUserId({ profileId }),
  })

  const { data: ctSubmissions, isLoading: isCtSubmissionsLoading } = useQuery({
    queryKey: ['ct-total-submissions', profileId],
    queryFn: () => getUserTotalCtSubmissions({ profileId }),
  })

  const { data: submissions, isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ['total-submissions', profileId],
    queryFn: () => getUserTotalSubmissions({ profileId }),
  })

  const { data: profiles, isLoading: isProfileListLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => getProfiles({ ascending: false }),
  })

  const isLoading =
    isProfileLoading ||
    isCtSubmissionsLoading ||
    isSubmissionsLoading ||
    isProfileListLoading

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return notFound()
  }

  const { level } = getUserLevel({
    experiencePoints: profile?.experience_points as number,
  })

  const userOwnsProfile = profileId === currentUserId

  const filteredProfiles = getLeaderboardWindow({
    profiles: profiles as ProfileType[],
    targetProfile: profile,
  })

  const getUserPosition = (id: string) => {
    return (profiles?.findIndex((item) => item.id === id) as number) + 1
  }

  const items = [
    {
      title: 'Nível',
      header: (
        <div className="flex h-full w-full items-center justify-center">
          <LevelBadge
            userLevel={level}
            className="size-32 text-5xl font-extrabold transition-all duration-300 group-hover/bento:scale-110"
          />
        </div>
      ),
      className: 'bg-gradient-to-tr from-background to-primary/10',
    },
    {
      title: 'Sobre mim',
      header: (
        <div className="flex h-full w-full items-center justify-center text-center text-muted-foreground">
          <p className="max-w-2xl">{profile?.bio}</p>
        </div>
      ),
      className: 'bg-gradient-to-tr from-background to-primary/10',
    },
    {
      title: 'Ranking',
      header: (
        <div className="h-full w-full space-y-4">
          {filteredProfiles.map((item) => (
            <div
              key={item.id}
              className="flex w-full items-center rounded-md px-2 py-4"
            >
              <div className="flex items-center gap-4">
                <ChevronsRight
                  className={cn({ invisible: item.id !== profile.id })}
                />
                <div className="w-8 text-center">
                  <UserPosition value={getUserPosition(item.id)} />
                </div>

                <p
                  className={cn({
                    'text-muted-foreground': item.id !== profile.id,
                  })}
                >
                  {item.username}
                </p>
              </div>
              <LevelBadge
                userLevel={
                  getUserLevel({
                    experiencePoints: item.experience_points as number,
                  }).level
                }
                className="ml-auto"
              />
            </div>
          ))}
        </div>
      ),
      className: 'bg-gradient-to-tr from-background to-primary/10',
    },
    {
      title: 'Sequência',
      description: `O jogador está em uma sequência de ${profile?.streak} acertos consecutivos.`,
      header: (
        <div className="flex h-full w-full items-center justify-center text-center text-muted-foreground">
          <Image
            src="/flame.png"
            alt="Imagem de Fogo"
            width={120}
            height={120}
            className="aspect-square h-40 w-40 transition-all duration-300 group-hover/bento:scale-110"
          />
        </div>
      ),
      className: 'bg-gradient-to-tr from-background to-orange-500/10',
    },
    {
      title: 'Carteira',
      description: `O jogador possui ${profile?.coins_amount} moedas`,
      header: (
        <div className="flex h-full w-full flex-col items-center justify-center text-center text-muted-foreground">
          <Image
            src="/coin-3d.png"
            alt="Imagem de Moeda"
            width={120}
            height={120}
            className="aspect-square h-40 w-40 transition-all duration-300 group-hover/bento:scale-110"
          />
        </div>
      ),
      className: 'bg-gradient-to-tr from-background to-yellow-400/10',
    },
    {
      title: 'Algoritmos',
      description: `O jogador completou ${submissions as number} problema(s) de algoritmos.`,
      header: (
        <div className="flex h-full w-full items-center justify-center text-center text-muted-foreground">
          <Image
            src="/3d-planet.png"
            alt="Imagem de Planeta"
            width={120}
            height={120}
            className="aspect-square h-40 w-40 transition-all duration-300 group-hover/bento:scale-110"
          />
        </div>
      ),
      className: 'bg-gradient-to-tr from-background to-primary/10',
    },
    {
      title: 'Mini Jogos',
      description: `O jogador completou ${ctSubmissions as number} mini jogo(s).`,
      header: (
        <div className="flex h-full w-full items-center justify-center text-center text-muted-foreground">
          <Image
            src="/3d-spaceship.png"
            alt="Imagem de Nave Espacial"
            width={120}
            height={120}
            className="aspect-square h-40 w-40 transition-all duration-300 group-hover/bento:scale-110"
          />
        </div>
      ),
      className: 'bg-gradient-to-tr from-background to-primary/10',
    },
  ]
  return (
    <main className="min-h-screen w-full overflow-x-hidden p-4">
      {userOwnsProfile && (
        <section className="relative mx-auto my-24 flex w-full items-center justify-end gap-4 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          <EditProfileDialog id={profileId} />
          <DeleteProfileDialog />
        </section>
      )}
      <section className="relative mx-auto my-24 w-full space-y-8 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex w-full flex-col items-center gap-8">
          <Avatar className="group size-48">
            <AvatarImage src={profile?.picture ?? undefined} />
            <span className="absolute hidden h-full w-full items-center justify-center bg-zinc-900/50 p-1 text-center text-sm font-bold text-zinc-100 transition-all duration-300 group-hover:flex group-hover:cursor-pointer">
              <ChangeProfilePicDialog
                id={profileId}
                profilePicture={profile?.picture ?? null}
                profilePictureFileName={profile?.picture_filename ?? null}
              />
            </span>
            <AvatarFallback>
              {profile?.username?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{profile?.username}</h1>
          {profile?.github_url && (
            <Button variant={'outline'} asChild>
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  color="#fff"
                  fill="none"
                >
                  <path
                    d="M6.51734 17.1132C6.91177 17.6905 8.10883 18.9228 9.74168 19.2333M9.86428 22C8.83582 21.8306 2 19.6057 2 12.0926C2 5.06329 8.0019 2 12.0008 2C15.9996 2 22 5.06329 22 12.0926C22 19.6057 15.1642 21.8306 14.1357 22C14.1357 22 13.9267 18.5826 14.0487 17.9969C14.1706 17.4113 13.7552 16.4688 13.7552 16.4688C14.7262 16.1055 16.2043 15.5847 16.7001 14.1874C17.0848 13.1032 17.3268 11.5288 16.2508 10.0489C16.2508 10.0489 16.5318 7.65809 15.9996 7.56548C15.4675 7.47287 13.8998 8.51192 13.8998 8.51192C13.4432 8.38248 12.4243 8.13476 12.0018 8.17939C11.5792 8.13476 10.5568 8.38248 10.1002 8.51192C10.1002 8.51192 8.53249 7.47287 8.00036 7.56548C7.46823 7.65809 7.74917 10.0489 7.74917 10.0489C6.67316 11.5288 6.91516 13.1032 7.2999 14.1874C7.79575 15.5847 9.27384 16.1055 10.2448 16.4688C10.2448 16.4688 9.82944 17.4113 9.95135 17.9969C10.0733 18.5826 9.86428 22 9.86428 22Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-semibold">Github</p>
              </a>
            </Button>
          )}
        </div>
        <BentoGrid className="mx-auto max-w-4xl bg-background">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn(
                'border bg-accent',
                {
                  'md:col-span-2': i === 1 || i === 2,
                },
                item.className,
              )}
            />
          ))}
        </BentoGrid>
      </section>
    </main>
  )
}

export default Profile
