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

interface ActivateInventoryItemRequest {
  inventoryId: number
  isActivated: boolean
}

export default async function addInventoryItem({
  skinId,
  userId,
}: AddInventoryItemProps) {
  const { data, error } = await supabase
    .from('inventories')
    .insert({ skin_id: skinId, profile_id: userId, is_activated: false })
    .select()

  if (error || !data) {
    throw new Error('Não foi possível comprar o item')
  }

  return data[0]
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

export async function activateInventoryItem({
  inventoryId,
  isActivated,
}: ActivateInventoryItemRequest) {
  const { data, error } = await supabase
    .from('inventories')
    .update({ is_activated: isActivated })
    .match({ id: inventoryId })

  if (error) {
    throw new Error('Não foi possível equipar o item.')
  }

  return data
}
