'use server'
import { createClient } from '@/utils/supabase/server'

const supabase = createClient()

export async function getTestCasesByProblemId({
  problemId,
}: {
  problemId: number
}) {
  const { data, error } = await supabase
    .from('test_cases')
    .select()
    .match({ problem_id: problemId })

  if (error) {
    throw new Error('Não foi possivel encontrar os casos de teste')
  }
  return data
}
