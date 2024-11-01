import React from 'react'
import Leaderboard from './components/leaderboard'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const Page = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  return (
    <main className="min-h-screen w-screen space-y-10 p-4 md:p-0">
      <section className="mx-auto mt-36 space-y-4 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <h1 className="text-4xl font-extrabold">Ranking</h1>
        <p className="text-muted-foreground">
          Você pode subir no ranking ao completar missões e ganhar{' '}
          <strong className="text-white">pontos de experiência</strong>.
        </p>
      </section>
      <Leaderboard user={user} />
    </main>
  )
}

export default Page
