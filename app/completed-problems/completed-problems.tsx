'use client'

import { getSubmissionsByProfileId } from '@/app/actions/submissions'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import DifficultyBadge from '@/components/ui/difficulty-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CompletedProblemsProps {
  userId: string
}

const CompletedProblemsSkeleton = () => {
  return (
    <div className="mx-auto mt-36 space-y-4 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
      {[...Array(10)].map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  )
}

const CompletedProblems = ({ userId }: CompletedProblemsProps) => {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['completed-problems', userId],
    queryFn: () => getSubmissionsByProfileId(),
  })

  if (isLoading) {
    return <CompletedProblemsSkeleton />
  }

  if (submissions === undefined || submissions.length === 0)
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center gap-8 gap-8 py-12">
        <div>
          <div className="m-auto flex w-[300px] gap-4 rounded-3xl border bg-white bg-opacity-[.03] p-2 text-card-foreground shadow-sm backdrop-blur-xl backdrop-filter md:m-0">
            <div className="h-16 w-16 flex-none rounded-2xl  bg-white bg-opacity-5 bg-opacity-5"></div>
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-3 w-2/3 rounded-lg  bg-white bg-opacity-5  bg-opacity-5"></div>
              <div className="h-2 w-full rounded-lg  bg-white bg-opacity-5  bg-opacity-5 "></div>
              <div className="h-2 w-full rounded-lg   bg-white bg-opacity-5  bg-opacity-5"></div>
            </div>
          </div>
          <div className="bg-opacity-[.01 m-auto flex w-[300px] -translate-y-4 translate-x-10 gap-4 rounded-3xl border bg-opacity-[.03] p-2 text-card-foreground shadow-sm backdrop-blur-xl backdrop-filter md:m-0">
            <div className="h-16 w-16 flex-none rounded-2xl  bg-white bg-opacity-5 bg-opacity-5"></div>
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-3 w-2/3 rounded-lg  bg-white bg-opacity-5  bg-opacity-5"></div>
              <div className="h-2 w-full rounded-lg  bg-white bg-opacity-5  bg-opacity-5 "></div>
              <div className="h-2 w-full rounded-lg   bg-white bg-opacity-5  bg-opacity-5"></div>
            </div>
          </div>
          <div className="absolute top-1/3 -z-10 h-12 w-32 rounded-full bg-blue-300/50 blur-3xl"></div>
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold">
            Você ainda não completou nenhum problema.
          </h3>
          <p className="text-muted-foreground">
            Resolva os desafios de algoritmos para iniciar sua jornada!
          </p>
          <Button asChild variant={'secondary'}>
            <Link href={'/code-problems'}>Começar</Link>
          </Button>
        </div>
      </main>
    )

  return (
    <>
      <section className="mx-auto mt-36 space-y-4 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        {submissions.map((submission) => (
          <Link
            href={`code-problems/${submission.problem_id}`}
            key={submission.id}
            className={cn(
              'flex items-center justify-between rounded-md bg-secondary p-4',
              {
                'bg-gradient-to-r from-secondary via-secondary to-green-500/10':
                  submission.problems?.difficulty === 'easy',
                'bg-gradient-to-r from-secondary via-secondary to-yellow-500/10':
                  submission.problems?.difficulty === 'medium',
                'bg-gradient-to-r from-secondary via-secondary to-red-500/10':
                  submission.problems?.difficulty === 'hard',
              },
            )}
          >
            <div>
              <h3 className="text-xl font-bold">{submission.problems?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {submission.problems?.description}
              </p>
            </div>

            {submission.problems?.difficulty && (
              <DifficultyBadge
                difficulty={submission.problems.difficulty}
                className="px-4 font-bold uppercase"
              />
            )}
          </Link>
        ))}
      </section>
    </>
  )
}

export default CompletedProblems
