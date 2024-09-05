'use server'
import { createClient } from '@/utils/supabase/server'

const supabase = createClient()

export async function getPerks() {
  const { data: perks, error } = await supabase.from('perks').select()
  if (error) {
    throw new Error('Não foi possivel encontrar os itens da loja')
  }
  return perks
}
