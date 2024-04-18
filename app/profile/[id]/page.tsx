import { getProfileByUserId } from '@/data/profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { notFound } from 'next/navigation'
import React from 'react'
import { Coins, Star } from 'lucide-react'
import { formatDate } from 'date-fns'

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const profile = await getProfileByUserId({ userId: id })

  if (!profile) {
    return notFound()
  }

  return (
    <main className="min-h-screen w-screen overflow-x-hidden">
      <section className="relative mx-auto my-24 w-full max-w-screen-xl space-y-2">
        <Avatar className="size-16">
          <AvatarImage src={profile.picture ?? undefined} />
          <AvatarFallback>
            {profile?.username?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex w-full items-center justify-between">
          <h1 className="font-bold">{profile.username}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Coins color="orange" />
              <span>{profile.coins_amount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star color="orange" />
              <span>{profile.experience_points}</span>
            </div>
          </div>
        </div>
        <span>
          Conta criada em {formatDate(profile.created_at, 'dd/MM/yyyy')}
        </span>
      </section>
    </main>
  )
}

export default Page
