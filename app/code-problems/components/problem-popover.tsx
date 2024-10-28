import { Problem } from '@/db/custom-types'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import DifficultyBadge from '@/components/ui/difficulty-badge'
import Image from 'next/image'
import Coin from '@/components/icons/coin'
import { getPlanet } from '@/utils/get-planet'
import Star from '@/components/icons/star'
import { Badge } from '@/components/ui/badge'

interface ProblemPopoverProps {
  problem: Problem
  lastProblemIdCompletedByUser: number
  currentProblemId: number
  className?: string
}

const ProblemPopover = ({
  problem,
  lastProblemIdCompletedByUser,
  currentProblemId,
  className,
}: ProblemPopoverProps) => {
  const isProblemAvailable =
    problem.id <= (lastProblemIdCompletedByUser as number) + 1

  const isCurrentProblem = currentProblemId === problem.id

  const isProblemCompleted = (currentProblemId as number) > problem.id

  const planet = getPlanet(problem.id)

  return (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger className={className}>
          <div>
            {isCurrentProblem && (
              <div className="relative top-12 flex animate-bounce flex-col items-center">
                <Badge className="text-md z-50 font-normal text-white hover:bg-primary">
                  Começar
                </Badge>
                <div className="relative bottom-4 h-5 w-5 rotate-45 bg-primary" />
              </div>
            )}
            <Image
              src={planet}
              alt={`imagem de Planeta`}
              width={250}
              height={250}
              className={cn({
                grayscale: !isProblemCompleted && !isCurrentProblem,
              })}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn('relative bottom-16 space-y-8', {
            grayscale: !isProblemAvailable,
          })}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{problem.name}</h3>
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
            <p className="text-sm text-muted-foreground">
              {problem.description}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Coin />
                {problem.coins_reward}
              </div>
              <div className="flex items-center gap-2">
                <Star />
                {problem.experience_reward}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {problem.topics.map((item) => (
              <Badge key={item} variant={'secondary'}>
                {item}
              </Badge>
            ))}
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
    </div>
  )
}

export default ProblemPopover
