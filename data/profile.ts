import { supabase } from '@/utils/supabase/supabase'

interface GetProfileByUserIdRequest {
  userId: string
}

export async function getProfileByUserId({
  userId,
}: GetProfileByUserIdRequest) {
  const { data: profile } = await supabase
    .from('profile')
    .select()
    .match({ id: userId })
    .limit(1)
    .single()

  return profile
}
