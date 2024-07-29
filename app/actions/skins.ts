'use server'
import { createClient } from '@/utils/supabase/server'

interface GetSkinByIdRequest {
  skinId: number
}

const supabase = createClient()

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
