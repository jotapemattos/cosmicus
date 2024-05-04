import { supabase } from '@/utils/supabase/supabase'

interface AddInventoryItemProps {
  skinId: number
  userId: string
}

interface GetInventoriesByUserIdRequest {
  profileId: string
}

interface GetInventoriesAndSkinsByUserIdRequest {
  profileId: string
}

export default async function addInventoryItem({
  skinId,
  userId,
}: AddInventoryItemProps) {
  const { data, error } = await supabase
    .from('inventories')
    .insert({ skin_id: skinId, profile_id: userId, is_activated: false })
  if (error) {
    throw new Error('Não foi possível comprar o item')
  }
  return data
}

export async function getInventoriesByUserId({
  profileId,
}: GetInventoriesByUserIdRequest) {
  const { data, error } = await supabase
    .from('inventories')
    .select()
    .match({ profile_id: profileId })

  if (error) {
    throw new Error('Não foi possível carregar o inventário')
  }

  return data
}

export async function getInventoriesAndSkinsByUserId({
  profileId,
}: GetInventoriesAndSkinsByUserIdRequest) {
  const { data, error } = await supabase
    .from('inventories')
    .select('*, skins (*)')
    .match({ profile_id: profileId })

  if (error) {
    throw new Error('Não foi possível carregar o inventário')
  }

  return data
}
