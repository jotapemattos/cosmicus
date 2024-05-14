import { supabase } from '@/utils/supabase/supabase'

export async function getProblems() {
  const { data, error } = await supabase.from('problems').select()
  if (error) {
    throw new Error('Não foi possivel encontrar os desafios')
  }
  return data
}

export async function getProblemById({ problemId }: { problemId: number }) {
  const { data, error } = await supabase
    .from('problems')
    .select()
    .match({ id: problemId })
    .single()
  if (error) {
    throw new Error('Não foi possivel encontrar os desafios')
  }
  return data
}
