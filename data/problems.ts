import { supabase } from '@/utils/supabase/supabase'

export async function getProblems() {
  const { data, error } = await supabase.from('problems').select().order('id')
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

export async function getCurrentProblemId({ userId }: { userId: string }) {
  const { error, count } = await supabase
    .from('submissions')
    .select('*', { count: 'exact' })
    .eq('profile_id', userId)
  if (error) {
    throw new Error('Não foi possivel encontrar os desafios')
  }
  if (!count) {
    return 1
  }
  return count + 1
}
