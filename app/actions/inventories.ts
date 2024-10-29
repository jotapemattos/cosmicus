'use server'

import { createClient } from '@/utils/supabase/server'

interface AddInventoryItemProps {
  skinId: number
}

interface ActivateInventoryItemRequest {
  inventoryId: number
}

interface RemoveInventoryItemRequest {
  inventoryId: number
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

export async function removeInventoryItem({
  inventoryId,
}: RemoveInventoryItemRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data: inventoryItem } = await supabase
    .from('inventories')
    .select()
    .eq('id', inventoryId)
    .single()

  if (!inventoryItem) {
    throw new Error('Não foi possível remover o item.')
  }

  const { data: skin } = await supabase
    .from('skins')
    .select()
    .eq('id', inventoryItem.skin_id as number)
    .single()

  if (!skin) {
    throw new Error('Não foi possível remover o item.')
  }

  const { data: profile } = await supabase
    .from('profile')
    .select()
    .eq('id', user.id)
    .single()

  if (!profile) {
    throw new Error('Não foi possível remover o item.')
  }

  const { error: deleteError } = await supabase
    .from('inventories')
    .delete()
    .eq('id', inventoryId)
    .eq('profile_id', user.id)
    .select()

  if (deleteError) {
    throw new Error(`Não foi possível remover o item`)
  }

  // updating profile coins_amount (returning user's coins after the item gets removed)

  await supabase
    .from('profile')
    .update({ coins_amount: profile.coins_amount + (skin.price as number) })
    .eq('id', user.id)

  return inventoryItem
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
}: ActivateInventoryItemRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  await supabase
    .from('inventories')
    .update({ is_activated: false })
    .match({ profile_id: user.id, is_activated: true })

  const { data, error } = await supabase
    .from('inventories')
    .update({ is_activated: true })
    .match({ id: inventoryId })

  if (error) {
    throw new Error('Não foi possível equipar o item.')
  }

  return data
}
