import { supabase } from '@/utils/supabase/supabase'

interface GetSkinByIdRequest {
  skinId: number
}

export async function getSkins() {
  const { data: skins, error } = await supabase.from('skins').select()
  if (error) {
    throw new Error('Não foi possivel encontrar os itens da loja')
  }
  return skins
}

export async function getSkinById({ skinId }: GetSkinByIdRequest) {
  const { data, error } = await supabase
    .from('skins')
    .select()
    .match({ id: skinId })
    .single()

  if (error) {
    throw new Error('Não foi possivel encontrar o item')
  }

  return data
}
