'use server'
import { createClient } from '@/utils/supabase/server'

const supabase = createClient()

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

export async function getCurrentProblemId() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { error, count } = await supabase
    .from('submissions')
    .select('*', { count: 'exact' })
    .eq('profile_id', user.id)
  if (error) {
    throw new Error('Não foi possivel encontrar os desafios')
  }
  if (!count) {
    return 1
  }
  return count + 1
}

// export async function getProblemById({
//   userId,
//   problemId,
// }: GetProblemByIdRequest): Promise<Problem> {
//   const { data, count } = await supabase
//     .from('submissions')
//     .select('*', { count: 'exact' })
//     .match({ problem_id: problemId, profile_id: userId })
//     .single()

//   const { data: problem, error: problemError } = await supabase
//     .from('problems')
//     .select()
//     .match({ id: problemId })
//     .single()

//   if (problemError) {
//     throw new Error('problem error')
//   }
//   if (count) {
//     problem.initial_value = data.code

//     return problem
//   }
//   return problem
// }
