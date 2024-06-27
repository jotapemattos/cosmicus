import { supabase } from '@/utils/supabase/supabase'

interface GetStoryTellingsByProblemIdRequest {
  problemId: number
}

export async function getStoryTellingsByProblemId({
  problemId,
}: GetStoryTellingsByProblemIdRequest) {
  const { data, error } = await supabase
    .from('story_telling')
    .select('*, characters (*)')
    .match({ problem_id: problemId })
    .order('id')

  if (error) {
    throw new Error('Não foi possível carregar a história')
  }

  return data
}
