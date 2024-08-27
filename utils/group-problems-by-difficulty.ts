import { Problem } from '@/db/custom-types'

export const groupProblemsByDifficulty = (
  problems: Problem[],
): { difficulty: string; problems: Problem[] }[] => {
  const groups: { [difficulty: string]: Problem[] } = {}
  const result: { difficulty: string; problems: Problem[] }[] = []

  // Group problems by difficulty
  problems.forEach((problem) => {
    const difficulty = problem.difficulty
    if (!groups[difficulty]) {
      groups[difficulty] = []
    }
    groups[difficulty].push(problem)
  })

  // Define the order of difficulties
  const difficultyOrder = ['easy', 'medium', 'hard']

  // Create result array in the desired order
  difficultyOrder.forEach((difficulty) => {
    if (groups[difficulty]) {
      result.push({ difficulty, problems: groups[difficulty] })
    }
  })

  return result
}
