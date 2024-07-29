'use server'

import { createClient } from '@/utils/supabase/server'

interface AddInventoryItemProps {
  skinId: number
}

interface ActivateInventoryItemRequest {
  inventoryId: number
  isActivated: boolean
}

const supabase = createClient()

export async function addInventoryItem({ skinId }: AddInventoryItemProps) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data, error } = await supabase
    .from('inventories')
    .insert({ skin_id: skinId, profile_id: user.id, is_activated: false })
    .select()

  if (error || !data) {
    throw new Error('Não foi possível comprar o item')
  }

  return data[0]
}

export async function getInventoriesByUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data, error } = await supabase
    .from('inventories')
    .select()
    .match({ profile_id: user.id })

  if (error) {
    throw new Error('Não foi possível carregar o inventário')
  }

  return data
}

export async function getInventoriesAndSkinsByUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')
  const { data, error } = await supabase
    .from('inventories')
    .select('*, skins (*)')
    .match({ profile_id: user.id })

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
