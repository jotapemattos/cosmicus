'use client'

import { getProfileByUserId } from '@/data/profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { notFound } from 'next/navigation'
import React from 'react'
import { Coins, Star } from 'lucide-react'
import { formatDate } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import EditProfileDialog from './edit-profile-dialog'
import DeleteProfileDialog from './delete-profile-dialog'

interface ProfileProps {
  profileId: string
  currentUserId: string
}

const Profile = ({ profileId, currentUserId }: ProfileProps) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => getProfileByUserId({ userId: profileId }),
  })

  if (!profile && !isLoading) {
    return notFound()
  }

  const userOwnsProfile = profileId === currentUserId

  return (
    <main className="min-h-screen w-screen overflow-x-hidden">
      <section className="relative mx-auto my-24 w-full max-w-screen-xl space-y-2">
        <Avatar className="size-16">
          <AvatarImage src={profile?.picture ?? undefined} />
          <AvatarFallback>
            {profile?.username?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex w-full items-center justify-between">
          <h1 className="font-bold">{profile?.username}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Coins color="orange" />
              <span>{profile?.coins_amount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star color="orange" />
              <span>{profile?.experience_points}</span>
            </div>
          </div>
        </div>
        {profile?.created_at && (
          <span>
            Conta criada em {formatDate(profile?.created_at, 'dd/MM/yyyy')}
          </span>
        )}
      </section>
      {userOwnsProfile && (
        <section className="relative mx-auto flex w-full max-w-screen-xl items-center justify-end gap-4">
          <EditProfileDialog id={profileId} />
          <DeleteProfileDialog profileId={profileId} />
        </section>
      )}
    </main>
  )
}

export default Profile
