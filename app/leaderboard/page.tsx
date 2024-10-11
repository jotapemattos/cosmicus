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
    <main className="min-h-screen w-screen space-y-10">
      <section className="mx-auto mt-36 max-w-screen-2xl space-y-4">
        <h1 className="text-4xl font-extrabold">Ranking</h1>
        <p>
          Você pode subir no ranking ao completar missões e ganhar{' '}
          <strong>pontos de experiência</strong>.
        </p>
      </section>
      <Leaderboard user={user} />
    </main>
  )
}

export default Page
