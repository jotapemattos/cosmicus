'use server'
import { createClient } from '@/utils/supabase/server'

interface GetSkinByIdRequest {
  skinId: number
}

const supabase = createClient()

export async function getSkins() {
  const { data: skins, error } = await supabase
    .from('skins')
    .select()
    .order('price')
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

export async function getUserSkin() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data, error } = await supabase
    .from('inventories')
    .select('*, skins (*)')
    .match({ profile_id: user.id, is_activated: true })
    .single()

  if (error) {
    console.log('Não foi possivel encontrar o item')
  }

  return data ? data.skins : null
}
