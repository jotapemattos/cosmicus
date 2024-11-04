import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SignIn from './sign-in'

const Page = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/')
  }

  return <SignIn />
}

export default Page
