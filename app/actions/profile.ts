'use server'
import { createClient } from '@/utils/supabase/server'

interface UpdateProfileRequest {
  username: string
  githubUrl: string | null
  bio: string | null
}

interface UpdateProfilePictureRequest {
  picture: string
  pictureFileName: string
}

interface GetProfilesRequest {
  ascending: boolean
}

const supabase = createClient()

export async function getProfileByUserId({ profileId }: { profileId: string }) {
  const { data: profile } = await supabase
    .from('profile')
    .select()
    .match({ id: profileId })
    .limit(1)
    .single()

  return profile
}

export async function getUserProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data: profile } = await supabase
    .from('profile')
    .select()
    .match({ id: user.id })
    .limit(1)
    .single()

  return profile
}

export async function updateProfile({
  username,
  githubUrl,
  bio,
}: UpdateProfileRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data: profile, error } = await supabase
    .from('profile')
    .update({ username, github_url: githubUrl, bio })
    .eq('id', user.id)

  if (error?.message.includes('unique constraint')) {
    throw new Error(`O usuário ${username} já existe no sistema.`)
  }

  if (error) {
    throw new Error('Não foi possível editar o perfil.')
  }

  return profile
}

export async function deleteProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { error } = await supabase
    .from('profile')
    .delete()
    .match({ id: user.id })

  if (error) {
    console.log(error)
    throw new Error('Não foi possível excluir a conta.')
  }
}

export async function updateProfilePicture({
  picture,
  pictureFileName,
}: UpdateProfilePictureRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data: profile, error } = await supabase
    .from('profile')
    .update({ picture, picture_filename: pictureFileName })
    .eq('id', user.id)

  if (error) {
    throw new Error('Não foi possível editar a foto de perfil.')
  }

  return profile
}

export async function getProfiles({ ascending }: GetProfilesRequest) {
  const { data: profiles, error } = await supabase
    .from('profile')
    .select()
    .order('experience_points', { ascending })

  if (error) {
    throw new Error('Não foi possível carregar os perfis.')
  }

  return profiles
}
