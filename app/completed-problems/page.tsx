import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CompletedProblems from './completed-problems'

export default async function Page() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  return (
    <main className="min-h-screen w-screen space-y-10 p-4 md:p-0">
      <CompletedProblems userId={user.id} />
    </main>
  )
}
