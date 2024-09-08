'use server'

import { createClient } from '@/utils/supabase/server'

interface AddInventoryItemProps {
  perkId: number
}

interface DecreaseUserPerksQuantityProps {
  perkId: number
}

const supabase = createClient()
export async function addPerksInventoryItem({ perkId }: AddInventoryItemProps) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data: existingItem } = await supabase
    .from('perks_inventories')
    .select()
    .match({ perk_id: perkId, profile_id: user.id })
    .single()

  if (existingItem) {
    const { data, error } = await supabase
      .from('perks_inventories')
      .update({ quantity: existingItem.quantity + 1 })
      .match({ id: existingItem.id })
      .select()
      .single()

    if (error || !data) {
      throw new Error('Não foi possível atualizar a quantidade.')
    }
    return data
  }

  const { data, error } = await supabase
    .from('perks_inventories')
    .insert({ perk_id: perkId, profile_id: user.id, quantity: 1 })
    .select()
  if (error || !data) {
    throw new Error('Não foi possível comprar o item')
  }
  return data
}

export async function getUserPerks() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data, error } = await supabase
    .from('perks_inventories')
    .select('*, perks (*)')
    .eq('profile_id', user.id)

  if (error) {
    throw new Error('O usuário não possui habilidades.')
  }

  return data
}

export async function decreaseUserPerksQuantity({
  perkId,
}: DecreaseUserPerksQuantityProps) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data: quantity } = await supabase
    .from('perks_inventories')
    .select('quantity')
    .eq('profile_id', user.id)
    .eq('perk_id', perkId)
    .single()

  if (!quantity) {
    return
  }

  const { data } = await supabase
    .from('perks_inventories')
    .update({ quantity: quantity.quantity - 1 })
    .eq('profile_id', user.id)
    .eq('perk_id', perkId)
    .select()
    .single()

  return data
}
