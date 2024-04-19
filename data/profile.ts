import { supabase } from '@/utils/supabase/supabase'

interface GetProfileByUserIdRequest {
  userId: string
}

interface UpdateProfileUsernameRequest {
  username: string
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

export async function updateProfileUsernameByUserId({
  username,
  userId,
}: UpdateProfileUsernameRequest) {
  const { data: profile, error } = await supabase
    .from('profile')
    .update({ username })
    .eq('id', userId)

  if (error?.message.includes('unique constraint')) {
    throw new Error(`O usuário ${username} já existe no sistema.`)
  }

  if (error) {
    throw new Error('Não foi possível editar o perfil.')
  }

  return profile
}
