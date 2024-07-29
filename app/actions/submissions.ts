'use server'
import { createClient } from '@/utils/supabase/server'

export interface CreateSubmissionRequest {
  problemId: number
  code: string
}

export interface UpdateSubmissionRequest {
  problemId: number
  code: string
}

interface HasCompletedProblemRequest {
  problemId: number
}

interface GetSubmissionByProblemIdAndProfileIdRequest {
  problemId: number
}

const supabase = createClient()

export async function createSubmission({
  problemId,
  code,
}: CreateSubmissionRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data, error } = await supabase
    .from('submissions')
    .insert({ problem_id: problemId, code, profile_id: user.id })
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
}: UpdateSubmissionRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { error } = await supabase
    .from('submissions')
    .update({ code })
    .match({ profile_id: user.id, problem_id: problemId })

  if (error) {
    throw new Error('Erro ao atualizar a submissao')
  }
}

export async function getSubmissionsByProfileId() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data, error } = await supabase
    .from('submissions')
    .select('*, problems (*)')
    .match({ profile_id: user.id })

  if (error) {
    throw new Error('Não foi possivel encontrar os problemas resolvidos.')
  }

  return data
}

export async function getSubmissionByProblemIdAndProfileId({
  problemId,
}: GetSubmissionByProblemIdAndProfileIdRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data } = await supabase
    .from('submissions')
    .select()
    .match({ profile_id: user.id, problem_id: problemId })
    .single()

  return data
}

export async function hasCompletedProblem({
  problemId,
}: HasCompletedProblemRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data } = await supabase
    .from('submissions')
    .select()
    .match({ profile_id: user.id, problem_id: problemId })

  if (!data || data.length === 0) return false

  return true
}

export async function getLastProblemIdCompletedByUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data } = await supabase
    .from('submissions')
    .select()
    .order('id', { ascending: false })
    .match({ profile_id: user.id })
    .limit(1)
    .single()

  if (!data) return 0

  return data.problem_id as number
}
