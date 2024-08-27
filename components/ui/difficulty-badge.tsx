import { getDifficultyInPortuguese } from '@/lib/get-difficulty-in-portuguese'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import React from 'react'

interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard'
}

const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  return (
    <Badge
      className={cn('w-fit', {
        'bg-red-500/10 text-red-500 hover:bg-red-500/10': difficulty === 'hard',
        'bg-green-500/10 text-green-500 hover:bg-green-500/10':
          difficulty === 'easy',
        'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10':
          difficulty === 'medium',
      })}
    >
      {getDifficultyInPortuguese({
        difficulty,
      })}
    </Badge>
  )
}

export default DifficultyBadge
