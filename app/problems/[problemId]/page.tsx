import CodePlayground from '@/components/code-playground'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'
import StoryTeliings from './components/story-teliings'
import { getLastProblemIdCompletedByUser } from '@/data/submissions'

interface PageProps {
  params: { problemId: number }
}

const Page = async ({ params: { problemId } }: PageProps) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const lastProblemIdCompletedByUser = await getLastProblemIdCompletedByUser({
    profileId: user.id,
  })

  const isUserAllowed = problemId <= lastProblemIdCompletedByUser + 1

  if (!isUserAllowed) {
    return redirect('/')
  }

  return (
    <div className="flex h-full min-h-screen w-screen items-center justify-center overflow-x-hidden">
      <CodePlayground problemId={problemId} userId={user.id} />
      <StoryTeliings problemId={problemId} />
    </div>
  )
}

export default Page
