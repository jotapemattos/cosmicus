import CodePlayground from '@/components/code-playground'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'

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

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <CodePlayground problemId={problemId} />
    </div>
  )
}

export default Page
