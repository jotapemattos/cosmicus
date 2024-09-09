'use server'
import { createClient } from '@/utils/supabase/server'

export interface CreateSubmissionRequest {
  problemId: number
  code: string
  hasDoubleCoins: boolean
  hasDoubleExperience: boolean
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
  hasDoubleCoins,
  hasDoubleExperience,
}: CreateSubmissionRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('O usuário não pode executar esta ação.')

  const { data: problem } = await supabase
    .from('problems')
    .select('experience_reward, coins_reward')
    .eq('id', problemId)
    .single()

  if (!problem) throw new Error('Problema não encontrado.')

  const coinsReward = hasDoubleCoins
    ? (problem.coins_reward as number) * 2
    : (problem.coins_reward as number)

  const experienceReward = hasDoubleExperience
    ? (problem.experience_reward as number) * 2
    : (problem.experience_reward as number)

  const { data, error } = await supabase
    .from('submissions')
    .insert({ problem_id: problemId, code, profile_id: user.id })
    .select()
    .single()

  if (error) {
    throw new Error('Não pode foi possivel submeter a solução.')
  }

  const { data: profile } = await supabase
    .from('profile')
    .select('coins_amount, experience_points')
    .eq('id', user.id)
    .single()

  if (!profile) throw new Error('Perfil não encontrado.')

  await supabase
    .from('profile')
    .update({
      coins_amount: profile.coins_amount + coinsReward,
      experience_points: profile.experience_points + experienceReward,
    })
    .eq('id', user.id)

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
