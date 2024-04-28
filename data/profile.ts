import { supabase } from '@/utils/supabase/supabase'

interface GetProfileByUserIdRequest {
  userId: string
}

interface UpdateProfileRequest {
  username: string
  userId: string
  githubUrl: string | null
  linkedinUrl: string | null
  bio: string | null
}

interface DeleteProfileRequest {
  profileId: string
}

interface UpdateProfilePictureRequest {
  userId: string
  picture: string
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

export async function updateProfile({
  username,
  userId,
  githubUrl,
  linkedinUrl,
  bio,
}: UpdateProfileRequest) {
  const { data: profile, error } = await supabase
    .from('profile')
    .update({ username, github_url: githubUrl, linkedin_url: linkedinUrl, bio })
    .eq('id', userId)

  if (error?.message.includes('unique constraint')) {
    throw new Error(`O usuário ${username} já existe no sistema.`)
  }

  if (error) {
    throw new Error('Não foi possível editar o perfil.')
  }

  return profile
}

export async function deleteProfile({ profileId }: DeleteProfileRequest) {
  const { error } = await supabase
    .from('profile')
    .delete()
    .match({ id: profileId })

  if (error) {
    throw new Error('Não foi possível excluir a conta.')
  }
}

export async function updateProfilePicture({
  userId,
  picture,
}: UpdateProfilePictureRequest) {
  const { data: profile, error } = await supabase
    .from('profile')
    .update({ picture })
    .eq('id', userId)

  if (error) {
    throw new Error('Não foi possível editar a foto de perfil.')
  }

  return profile
}
