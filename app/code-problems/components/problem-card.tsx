import { Problem, Skin } from '@/db/custom-types'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import DifficultyBadge from '@/components/ui/difficulty-badge'
import Image from 'next/image'
import Coin from '@/components/icons/coin'
import { getPlanet } from '@/utils/get-planet'
import Star from '@/components/icons/star'
import { Badge } from '@/components/ui/badge'
import { LockKeyhole, Rocket, RotateCcw } from 'lucide-react'

interface ProblemCardProps {
  problem: Problem
  lastProblemIdCompletedByUser: number
  currentProblemId: number
  skin: Skin | null
}

const ProblemCard = ({
  problem,
  lastProblemIdCompletedByUser,
  currentProblemId,
  skin,
}: ProblemCardProps) => {
  const isProblemAvailable =
    problem.id <= (lastProblemIdCompletedByUser as number) + 1

  const isCurrentProblem = currentProblemId === problem.id

  const isProblemCompleted = (currentProblemId as number) > problem.id

  const planet = getPlanet(problem.id)

  const cardRef = useRef<HTMLDivElement>(null)

  // Use effect to scroll to the current problem card
  useEffect(() => {
    if (isCurrentProblem && cardRef.current) {
      // Scroll to the card with smooth behavior and centered alignment
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentProblemId, isCurrentProblem])

  return (
    <div
      className="flex w-full flex-col-reverse items-center gap-4 md:flex-row"
      ref={cardRef}
    >
      <div
        className={cn(
          'group relative flex w-full flex-col overflow-hidden rounded-xl bg-gradient-to-r px-4 py-8 md:flex-row lg:h-60',
          {
            'from-blue-400/60 to-blue-600/60': planet.color === 'blue',
            'from-green-400/60 to-green-600/60': planet.color === 'green',
            'from-indigo-400/60 to-indigo-600/60': planet.color === 'purple',
            'from-yellow-400/80 to-yellow-600/80': planet.color === 'yellow',
            'from-red-400/80 to-red-600/80': planet.color === 'red',
            'from-pink-400/60 to-pink-600/60': planet.color === 'pink',
            'bg-secondary grayscale': !isProblemAvailable,
            'brightness-80 opacity-50': isProblemCompleted,
            'brightness-120': isCurrentProblem,
          },
        )}
      >
        <Image
          src={planet.src}
          alt={`imagem de Planeta`}
          width={180}
          height={180}
          className={cn('z-10 aspect-square size-44 self-center', {
            grayscale: !isProblemCompleted && !isCurrentProblem,
          })}
        />
        <div className="flex w-full flex-col justify-between gap-8 lg:flex-row">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{problem.name}</h3>
              <DifficultyBadge difficulty={problem.difficulty} />{' '}
            </div>
            <p className="text-sm">{problem.description}</p>
            <div className="space-y-4">
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Coin />
                    {problem.coins_reward}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star />
                    {problem.experience_reward}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {problem.topics.map((item) => (
                    <Badge
                      key={item}
                      className={cn('w-fit text-background', {
                        'cursor-not-allowed': !isProblemAvailable,
                        'bg-blue-300 hover:bg-blue-200':
                          planet.color === 'blue',
                        'bg-green-300 hover:bg-green-200':
                          planet.color === 'green',
                        'bg-indigo-300 hover:bg-indigo-200':
                          planet.color === 'purple',
                        'bg-yellow-100 hover:bg-yellow-50':
                          planet.color === 'yellow',
                        'bg-red-300 hover:bg-red-200': planet.color === 'red',
                        'bg-pink-300 hover:bg-pink-200':
                          planet.color === 'pink',
                      })}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Button
            className={cn(
              'z-50 flex w-full items-center gap-2 text-background lg:w-fit lg:self-end',
              {
                'cursor-not-allowed': !isProblemAvailable,
                'bg-blue-300 hover:bg-blue-200': planet.color === 'blue',
                'bg-green-300 hover:bg-green-200': planet.color === 'green',
                'bg-indigo-300 hover:bg-indigo-200': planet.color === 'purple',
                'bg-yellow-100 hover:bg-yellow-50': planet.color === 'yellow',
                'bg-red-300 hover:bg-red-200': planet.color === 'red',
                'bg-pink-300 hover:bg-pink-200': planet.color === 'pink',
              },
            )}
            asChild
            disabled={!isProblemAvailable}
          >
            <Link
              href={
                problem.id <= (lastProblemIdCompletedByUser as number) + 1
                  ? `code-problems/${problem.id}`
                  : 'code-problems'
              }
            >
              {isCurrentProblem && (
                <>
                  <Rocket size={16} />
                  <div>Começar</div>
                </>
              )}
              {isProblemCompleted && (
                <>
                  <RotateCcw size={16} />
                  Fazer novamente
                </>
              )}
              {!isProblemAvailable && (
                <>
                  <LockKeyhole size={16} />
                  Bloqueado
                </>
              )}
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-3/4 left-full z-0 w-full -translate-x-1/4 translate-y-1/4 rotate-[45deg] sm:bottom-1/2 md:-bottom-24 md:-left-4 md:rotate-[30deg] lg:-bottom-28 xl:-bottom-36 2xl:-bottom-44">
          <div
            className={cn(
              '-ml-4 h-12 w-full border-t border-neutral-700/50 bg-gradient-to-r duration-500 group-hover:-translate-y-1',
              {
                'from-blue-100 to-blue-300': planet.color === 'blue',
                'from-green-100 to-green-300': planet.color === 'green',
                'from-indigo-100 to-indigo-300': planet.color === 'purple',
                'from-yellow-100 to-yellow-300': planet.color === 'yellow',
                'from-red-100 to-red-300': planet.color === 'red',
                'from-pink-100 to-pink-300': planet.color === 'pink',
              },
            )}
          ></div>
          <div
            className={cn(
              '-ml-8 h-12 w-full border-t border-neutral-700/50 bg-gradient-to-r from-blue-100 to-blue-300 duration-500 group-hover:-translate-y-5',
              {
                'from-blue-100 to-blue-300': planet.color === 'blue',
                'from-green-100 to-green-300': planet.color === 'green',
                'from-indigo-100 to-indigo-300': planet.color === 'purple',
                'from-yellow-100 to-yellow-300': planet.color === 'yellow',
                'from-red-100 to-red-300': planet.color === 'red',
                'from-pink-100 to-pink-300': planet.color === 'pink',
              },
            )}
          ></div>
          <div
            className={cn(
              '-ml-12 h-12 w-full border-t border-neutral-700/50 bg-gradient-to-r from-blue-100 to-blue-300 duration-500 group-hover:-translate-y-8',
              {
                'from-blue-100 to-blue-300': planet.color === 'blue',
                'from-green-100 to-green-300': planet.color === 'green',
                'from-indigo-100 to-indigo-300': planet.color === 'purple',
                'from-yellow-100 to-yellow-300': planet.color === 'yellow',
                'from-red-100 to-red-300': planet.color === 'red',
                'from-pink-100 to-pink-300': planet.color === 'pink',
              },
            )}
          ></div>
          <div
            className={cn(
              '-ml-16 h-12 w-full border-t border-neutral-700/50 bg-gradient-to-r from-blue-100 to-blue-300 duration-500 group-hover:-translate-y-12',
              {
                'from-blue-100 to-blue-300': planet.color === 'blue',
                'from-green-100 to-green-300': planet.color === 'green',
                'from-indigo-100 to-indigo-300': planet.color === 'purple',
                'from-yellow-100 to-yellow-300': planet.color === 'yellow',
                'from-red-100 to-red-300': planet.color === 'red',
                'from-pink-100 to-pink-300': planet.color === 'pink',
              },
            )}
          ></div>
        </div>
      </div>
      <Image
        src={skin?.picture ?? '/default-skin.png'}
        alt="Imagem de Skin"
        width={200}
        height={200}
        className={cn({
          'hidden opacity-0 md:block': !isCurrentProblem,
        })}
      />
    </div>
  )
}

export default ProblemCard
