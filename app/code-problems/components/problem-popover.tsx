import { Problem } from '@/db/custom-types'
import { cn } from '@/lib/utils'
import { Coins, Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import DifficultyBadge from '@/components/ui/difficulty-badge'

interface ProblemPopoverProps {
  problem: Problem
  lastProblemIdCompletedByUser: number
  currentProblemId: number
}

const ProblemPopover = ({
  problem,
  lastProblemIdCompletedByUser,
  currentProblemId,
}: ProblemPopoverProps) => {
  const isProblemAvailable =
    problem.id <= (lastProblemIdCompletedByUser as number) + 1

  const isCurrentProblem = currentProblemId === problem.id

  const isProblemCompleted = (currentProblemId as number) > problem.id

  return (
    <Popover>
      <PopoverTrigger
        className={cn('rounded-full bg-sky-400 p-4', {
          'bg-sky-950': isCurrentProblem,
          'bg-green-500': isProblemCompleted,
          grayscale: !isProblemAvailable,
        })}
      >
        <Star className="fill-white stroke-white" />
      </PopoverTrigger>
      <PopoverContent
        className={cn('space-y-8', {
          grayscale: !isProblemAvailable,
        })}
      >
        <div>
          <h3 className="font-semibold">{problem.name}</h3>
          <p className="text-sm">{problem.description}</p>
        </div>
        <div className="space-y-4">
          <DifficultyBadge difficulty={problem.difficulty} />
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Coins />
              {problem.coins_reward}
            </div>
            <div className="flex items-center gap-2">
              <Star />
              {problem.experience_reward}
            </div>
          </div>
        </div>
        <Button
          className={cn('w-full', {
            'cursor-not-allowed': !isProblemAvailable,
          })}
          asChild
          disabled={!isProblemAvailable}
        >
          <Link
            href={
              // unable user to access a problem that it's not allowed
              problem.id <= (lastProblemIdCompletedByUser as number) + 1
                ? `code-problems/${problem.id}`
                : '/'
            }
          >
            {isCurrentProblem && 'Começar'}
            {isProblemCompleted && 'Fazer novamente'}
            {!isProblemAvailable && 'Bloqueado'}
          </Link>
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export default ProblemPopover
