import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SignUp from './sign-up'

const Page = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/')
  }

  return <SignUp />
}

export default Page
