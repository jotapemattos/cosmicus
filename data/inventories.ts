import { supabase } from '@/utils/supabase/supabase'

interface AddInventoryItemProps {
  skinId: number
  userId: string
}

export default async function addInventoryItem({
  skinId,
  userId,
}: AddInventoryItemProps) {
  const { data, error } = await supabase
    .from('inventories')
    .insert({ skin_id: skinId, profile_id: userId, is_activated: false })
  if (error) {
    console.log(error)
    //    throw new Error('Não foi possível comprar o item')
  }
  return data
}
