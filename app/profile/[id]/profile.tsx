'use client'

import { getProfileByUserId } from '@/data/profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { notFound } from 'next/navigation'
import React from 'react'
import { CalendarDays, Coins, Linkedin, Star } from 'lucide-react'
import { formatDate } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import EditProfileDialog from './edit-profile-dialog'
import DeleteProfileDialog from './delete-profile-dialog'
import { Button } from '@/components/ui/button'
import ChangeProfilePicDialog from './change-profile-pic-dialog'

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
    <main className="min-h-screen w-screen overflow-x-hidden p-4">
      <section className="relative mx-auto my-24 w-full max-w-screen-xl space-y-8">
        <Avatar className="group size-24">
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
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">{profile?.username}</h1>
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
        {profile?.bio && <p className="max-w-2xl">{profile?.bio}</p>}
        {profile?.created_at && (
          <div className="flex gap-2">
            <CalendarDays size={18} />
            <p className="text-sm">
              Conta criada em {formatDate(profile?.created_at, 'dd/MM/yyyy')}
            </p>
          </div>
        )}
        <div className="flex items-center gap-4">
          {profile?.github_url && (
            <Button variant={'secondary'} asChild>
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
                  color="#000000"
                  fill="none"
                >
                  <path
                    d="M6.51734 17.1132C6.91177 17.6905 8.10883 18.9228 9.74168 19.2333M9.86428 22C8.83582 21.8306 2 19.6057 2 12.0926C2 5.06329 8.0019 2 12.0008 2C15.9996 2 22 5.06329 22 12.0926C22 19.6057 15.1642 21.8306 14.1357 22C14.1357 22 13.9267 18.5826 14.0487 17.9969C14.1706 17.4113 13.7552 16.4688 13.7552 16.4688C14.7262 16.1055 16.2043 15.5847 16.7001 14.1874C17.0848 13.1032 17.3268 11.5288 16.2508 10.0489C16.2508 10.0489 16.5318 7.65809 15.9996 7.56548C15.4675 7.47287 13.8998 8.51192 13.8998 8.51192C13.4432 8.38248 12.4243 8.13476 12.0018 8.17939C11.5792 8.13476 10.5568 8.38248 10.1002 8.51192C10.1002 8.51192 8.53249 7.47287 8.00036 7.56548C7.46823 7.65809 7.74917 10.0489 7.74917 10.0489C6.67316 11.5288 6.91516 13.1032 7.2999 14.1874C7.79575 15.5847 9.27384 16.1055 10.2448 16.4688C10.2448 16.4688 9.82944 17.4113 9.95135 17.9969C10.0733 18.5826 9.86428 22 9.86428 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Github
              </a>
            </Button>
          )}
          {profile?.linkedin_url && (
            <Button variant={'secondary'} asChild>
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <Linkedin />
                Linkedin
              </a>
            </Button>
          )}
        </div>
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
