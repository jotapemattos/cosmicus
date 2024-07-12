import { supabase } from '@/utils/supabase/supabase'

export interface CreateSubmissionRequest {
  problemId: number
  code: string
  profileId: string
}

export interface UpdateSubmissionRequest {
  problemId: number
  code: string
  profileId: string
}

interface GetSubmissionsByProfileIdRequest {
  profileId: string
}

interface HasCompletedProblemRequest {
  profileId: string
  problemId: number
}

interface GetLastProblemIdCompletedByUserRequest {
  profileId: string
}

interface GetSubmissionByProblemIdAndProfileIdRequest {
  profileId: string
  problemId: number
}

export async function createSubmission({
  problemId,
  code,
  profileId,
}: CreateSubmissionRequest) {
  const { data, error } = await supabase
    .from('submissions')
    .insert({ problem_id: problemId, code, profile_id: profileId })
    .select()
    .single()

  if (error) {
    console.log(error)
  }

  console.log(data)

  return data
}

export async function updateSubmission({
  problemId,
  code,
  profileId,
}: UpdateSubmissionRequest) {
  const { error } = await supabase
    .from('submissions')
    .update({ code })
    .match({ profile_id: profileId, problem_id: problemId })

  if (error) {
    throw new Error('Erro ao atualizar a submissao')
  }
}

export async function getSubmissionsByProfileId({
  profileId,
}: GetSubmissionsByProfileIdRequest) {
  const { data, error } = await supabase
    .from('submissions')
    .select('*, problems (*)')
    .match({ profile_id: profileId })

  if (error) {
    throw new Error('Não foi possivel encontrar os problemas resolvidos.')
  }

  return data
}

export async function getSubmissionByProblemIdAndProfileId({
  problemId,
  profileId,
}: GetSubmissionByProblemIdAndProfileIdRequest) {
  const { data } = await supabase
    .from('submissions')
    .select()
    .match({ profile_id: profileId, problem_id: problemId })
    .single()

  return data
}

export async function hasCompletedProblem({
  profileId,
  problemId,
}: HasCompletedProblemRequest) {
  const { data } = await supabase
    .from('submissions')
    .select()
    .match({ profile_id: profileId, problem_id: problemId })

  if (!data || data.length === 0) return false

  return true
}

export async function getLastProblemIdCompletedByUser({
  profileId,
}: GetLastProblemIdCompletedByUserRequest) {
  const { data } = await supabase
    .from('submissions')
    .select()
    .order('id', { ascending: false })
    .match({ profile_id: profileId })
    .limit(1)
    .single()

  if (!data) return 0

  return data.problem_id as number
}
