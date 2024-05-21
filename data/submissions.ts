import { supabase } from '@/utils/supabase/supabase'

export interface CreateSubmissionRequest {
  problemId: number
  code: string
  profileId: string
}

interface GetSubmissionsByProfileIdRequest {
  profileId: string
}

export async function createSubmission({
  problemId,
  code,
  profileId,
}: CreateSubmissionRequest) {
  const { error } = await supabase
    .from('submissions')
    .insert({ problem_id: problemId, code, profile_id: profileId })

  if (error) {
    throw new Error('Não foi possivel enviar o código.')
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
