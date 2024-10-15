'use server'
import { createClient } from '@/utils/supabase/server'

interface CreateCtSubmissionRequest {
  ctProblemId: number
  timeInSeconds: number
}

interface GetUserCtSubmissionByCategoryProps {
  category: string
}

const supabase = createClient()

export async function createCtSubmission({
  ctProblemId,
  timeInSeconds,
}: CreateCtSubmissionRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autorizado.')

  const { data, error } = await supabase
    .from('ct_fundamentals_submissions')
    .insert({
      ct_fundamentals_problem_id: ctProblemId,
      time_in_seconds: timeInSeconds,
    })
    .select()
    .single()

  if (error) {
    throw new Error('Não foi possivel submeter o problema.')
  }
  return data
}

export async function getUserCtSubmissionByCategory({
  category,
}: GetUserCtSubmissionByCategoryProps) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autorizado.')

  const { data, error } = await supabase
    .from('ct_fundamentals_submissions')
    .select('*, ct_fundamentals_problems (*)')
    .eq('profile_id', user.id)
    .eq('ct_fundamentals_problems.category', category)

  if (error) {
    console.log(error)
    throw new Error('Não foi possivel submeter o problema.')
  }

  return data
}
