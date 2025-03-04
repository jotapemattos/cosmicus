import CodePlayground from './components/code-playground'
import { redirect } from 'next/navigation'
import React from 'react'
import StoryTeliings from './components/story-teliings'
import { createClient } from '@/utils/supabase/server'
import { supabase as supabaseClient } from '@/utils/supabase/supabase'

interface PageProps {
  params: { problemId: number }
}

const Page = async ({ params: { problemId } }: PageProps) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const getLastProblemIdCompletedByUser = async () => {
    const { data } = await supabaseClient
      .from('submissions')
      .select()
      .order('id', { ascending: false })
      .match({ profile_id: user?.id })
      .limit(1)
      .single()

    if (!data) return 0

    return data.problem_id as number
  }

  const lastProblemIdCompletedByUser = await getLastProblemIdCompletedByUser()
  const isUserAllowed = problemId <= lastProblemIdCompletedByUser + 1

  if (!isUserAllowed) {
    return redirect('/')
  }

  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center p-4 lg:p-0">
      <CodePlayground userId={user.id} />
      <StoryTeliings problemId={problemId} />
    </div>
  )
}

export default Page
