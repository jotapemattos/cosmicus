'use client'

import { getUserCtSubmissionByCategory } from '@/app/actions/ct-fundamentals-submission'
import { getCtProblemsByCategory } from '@/app/actions/ct-problems'
import Coin from '@/components/icons/coin'
import Star from '@/components/icons/star'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import DifficultyBadge from '@/components/ui/difficulty-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

interface CtProblemsListProps {
  category: string
}

const CtProblemsSkeleton = () => (
  <div className="mx-auto my-32 max-w-screen-2xl space-y-2">
    {[...Array(10)].map((_, index) => (
      <Skeleton key={index} className="h-14 w-full" />
    ))}
  </div>
)

const CtProblemsList: React.FC<CtProblemsListProps> = ({ category }) => {
  const { data: problems, isError: isProblemsError } = useQuery({
    queryKey: ['ct-problems', category],
    queryFn: () => getCtProblemsByCategory({ category }),
  })

  const { data: submisisons } = useQuery({
    queryKey: ['ct-submissions', category],
    queryFn: () => getUserCtSubmissionByCategory({ category }),
  })

  if (isProblemsError) {
    return notFound()
  }

  if (problems === undefined || submisisons === undefined) {
    return <CtProblemsSkeleton />
  }

  const hasCompletedProblem = (id: number) => {
    return submisisons.some((item) => item.ct_fundamentals_problem_id === id)
  }

  return (
    <Accordion
      className="mx-auto my-32 max-w-screen-2xl space-y-2"
      type="single"
      collapsible
    >
      {problems.map((item, index) => (
        <AccordionItem
          value={`item-${index}`}
          key={item.id}
          className="rounded-md border bg-gradient-to-r from-accent via-accent to-primary/15 px-4"
        >
          <AccordionTrigger>
            <div className="flex items-center gap-4">
              {hasCompletedProblem(item.id) ? (
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={18} />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-white p-[1px]">
                  <div className='rounded-full w-full h-full bg-accent'></div>
                </div>
              )}
              {item.name}
              <div>
                <DifficultyBadge difficulty={item.difficulty} />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <h4 className="font-semibold text-muted-foreground">
              {item.ct_pillar}
            </h4>
            <div className="flex items-center gap-2">
              <Coin />
              {item.coins_reward}
            </div>
            <div className="flex items-center gap-2">
              <Star />
              {item.experience_reward}
            </div>
            <Button asChild variant={'accent'} className="w-fit">
              <Link href={`/ct-problems/${item.category}/${item.id}`}>
                Começar
              </Link>
            </Button>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default CtProblemsList
