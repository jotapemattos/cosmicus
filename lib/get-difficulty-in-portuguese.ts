interface GetDifficultyInPortugueseProps {
  difficulty: 'easy' | 'medium' | 'hard'
}

const difficultyMap = new Map<string, string>([
  ['easy', 'fácil'],
  ['medium', 'médio'],
  ['hard', 'difícil'],
])

export function getDifficultyInPortuguese({
  difficulty,
}: GetDifficultyInPortugueseProps) {
  return difficultyMap.get(difficulty)
}
