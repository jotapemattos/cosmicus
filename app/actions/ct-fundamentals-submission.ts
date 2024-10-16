'use server'
import { createClient } from '@/utils/supabase/server'

interface CreateCtSubmissionRequest {
  ctProblemId: number
  timeInSeconds: number
}

interface GetUserCtSubmissionByCategoryProps {
  category: string
}

interface GetUserTotalCtSubmissionsRequest {
  profileId: string
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

  // if user already has completed the problems, just return its submission
  const { data: submission } = await supabase
    .from('ct_fundamentals_submissions')
    .select()
    .eq('ct_fundamentals_problem_id', ctProblemId)
    .eq('profile_id', user.id)

  if (submission && submission.length > 0) {
    return submission
  }

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

export async function getUserTotalCtSubmissions({
  profileId,
}: GetUserTotalCtSubmissionsRequest) {
  const { data, error } = await supabase
    .from('ct_fundamentals_submissions')
    .select('*')
    .eq('profile_id', profileId)

  if (error) {
    throw new Error('Não foi possivel encontrar o total.')
  }

  return data.length
}
