import { supabase } from '@/utils/supabase/supabase'

export async function getSkins() {
  const { data: skins, error } = await supabase.from('skins').select()
  if (error) {
    throw new Error('Não foi possivel encontrar os itens da loja')
  }
  return skins
}
