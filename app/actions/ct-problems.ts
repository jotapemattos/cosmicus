'use server'
import { createClient } from '@/utils/supabase/server'

const supabase = createClient()

interface GetCtProblemsByCategoryRequest {
  category: string
}

export async function getCtProblemsByCategory({
  category,
}: GetCtProblemsByCategoryRequest) {
  const { data: problems, error } = await supabase
    .from('ct_fundamentals_problems')
    .select()
    .eq('category', category)

  if (error) {
    throw new Error('Não foi possivel encontrar os problemas.')
  }
  return problems
}
