import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import Profile from './profile'

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  return <Profile profileId={id} currentUserId={user.id} />
}

export default Page
