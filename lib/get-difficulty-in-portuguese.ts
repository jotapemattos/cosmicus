interface GetDifficultyInPortugueseProps {
  difficulty: 'easy' | 'medium' | 'hard'
}

export function getDifficultyInPortuguese({
  difficulty,
}: GetDifficultyInPortugueseProps) {
  switch (difficulty) {
    case 'easy':
      return 'fácil'
    case 'medium':
      return 'médio'
    case 'hard':
      return 'difícil'
  }
}
