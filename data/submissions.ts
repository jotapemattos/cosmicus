import { supabase } from '@/utils/supabase/supabase'

export interface CreateSubmissionRequest {
  problemId: number
  code: string
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
