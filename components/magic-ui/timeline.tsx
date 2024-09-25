import { Problem, Skin } from '@/db/custom-types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import DifficultyBadge from '../ui/difficulty-badge'
import Link from 'next/link'
import Image from 'next/image'
import { getPlanet } from '@/utils/get-planet'
import Coin from '../icons/coin'
import Star from '../icons/star'

interface TimelineProps {
  problems: Problem[]
  lastProblemIdCompletedByUser: number
  currentProblemId: number
  skin: Skin
}

export const Timeline = ({
  problems,
  lastProblemIdCompletedByUser,
  currentProblemId,
  skin,
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setHeight(rect.height)
    }
  }, [ref])

  return (
    <div className="w-full" ref={containerRef}>
      <div className="py-20">
        <h2 className="mb-4 max-w-4xl text-lg font-bold text-white md:text-4xl">
          Explorando o universo da programação
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground dark:text-neutral-300 md:text-base">
          Embarque em uma emocionante jornada espacial para explorar os
          mistérios do universo e desenvolver suas habilidades de pensamento
          computacional! Cada planeta representa um desafio único que exigirá
          que você utilize seus conhecimentos de lógica e programação para
          resolvê-los. Prepare-se para decodificar mensagens alienígenas,
          construir robôs e até mesmo pilotar uma nave espacial!
        </p>
      </div>

      <div ref={ref} className="relative pb-20">
        {problems.map((item) => {
          const isProblemAvailable =
            item.id <= (lastProblemIdCompletedByUser as number) + 1

          const isCurrentProblem = currentProblemId === item.id

          const isProblemCompleted = (currentProblemId as number) > item.id

          const planet = getPlanet(item.id)

          return (
            <div key={item.id} className="flex h-[400px] justify-start">
              {/* Timeline Circle */}
              <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
                {isCurrentProblem && (
                  <Image
                    src={skin.picture as string}
                    alt={`Skin ${skin.name}`}
                    width={120}
                    height={120}
                    className="absolute -left-6 bottom-40 z-50"
                  />
                )}

                <Image
                  src={planet}
                  alt={`imagem de Planeta`}
                  width={200}
                  height={200}
                  className={cn('relative -left-16', {
                    grayscale: !isProblemCompleted && !isCurrentProblem,
                  })}
                />
                <h3 className="hidden text-xl font-bold text-neutral-500 dark:text-neutral-500 md:block md:pl-20 md:text-5xl">
                  {item.name}
                </h3>
              </div>

              {/* Content */}
              <div className="flex w-full flex-col items-end justify-start gap-4  pl-20 pr-4 md:pl-4">
                <h3 className="mb-4 block text-left text-2xl font-bold text-neutral-500 dark:text-neutral-500 md:hidden">
                  {item.name}
                </h3>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm">{item.description}</p>
                </div>
                <div className="space-y-4">
                  <DifficultyBadge difficulty={item.difficulty} />
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Coin />
                      {item.coins_reward}
                    </div>
                    <div className="flex items-center gap-2">
                      <Star />
                      {item.experience_reward}
                    </div>
                  </div>
                </div>
                <Button
                  className={cn('w-fit', {
                    'cursor-not-allowed': !isProblemAvailable,
                  })}
                  asChild
                  disabled={!isProblemAvailable}
                  variant={
                    isProblemCompleted
                      ? 'accent'
                      : isCurrentProblem
                        ? 'green'
                        : 'red'
                  }
                >
                  <Link
                    href={
                      // unable user to access a problem that it's not allowed
                      item.id <= (lastProblemIdCompletedByUser as number) + 1
                        ? `code-problems/${item.id}`
                        : '/'
                    }
                  >
                    {isCurrentProblem && 'Começar'}
                    {isProblemCompleted && 'Fazer novamente'}
                    {!isProblemAvailable && 'Bloqueado'}
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}

        {/* Vertical timeline tracing */}
        <div
          style={{
            height: height + 'px',
          }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] dark:via-neutral-700  md:left-8"
        >
          {/* Green section for completed problems */}
          <motion.div
            style={{
              height:
                (lastProblemIdCompletedByUser / problems.length) * height +
                'px',
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-green-500 via-green-500 to-transparent"
          >
            <div className="absolute left-full top-1/2 -translate-y-1/2 transform">
              <Image
                src={skin.picture as string}
                alt="Skin"
                width={50}
                height={50}
              />
            </div>
          </motion.div>

          {/* Purple section for non-completed problems */}
          <motion.div
            style={{
              top:
                (lastProblemIdCompletedByUser / problems.length) * height +
                'px',
              height:
                height -
                (lastProblemIdCompletedByUser / problems.length) * height +
                'px',
            }}
            className={`absolute inset-x-0 w-[2px] rounded-full ${currentProblemId <= lastProblemIdCompletedByUser ? 'bg-gradient-to-t from-green-500 via-green-500 to-transparent' : 'bg-gradient-to-t from-red-500 via-red-500 to-transparent'}`}
          />
        </div>
      </div>
    </div>
  )
}
