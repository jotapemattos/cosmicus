'use client'

import { Badge } from '@/components/ui/badge'
import { getSubmissionsByProfileId } from '@/app/actions/submissions'
import { getDifficultyInPortuguese } from '@/lib/get-difficulty-in-portuguese'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

interface CompletedProblemsProps {
  userId: string
}

const CompletedProblems = ({ userId }: CompletedProblemsProps) => {
  const { data: submissions } = useQuery({
    queryKey: ['completed-problems', userId],
    queryFn: () => getSubmissionsByProfileId(),
  })

  if (submissions === undefined) return

  return (
    <section className="mx-auto mt-36 max-w-screen-2xl space-y-4">
      {submissions.map((submission) => (
        <div key={submission.id} className="rounded-md bg-secondary p-4">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold">{submission.problems?.name}</h3>
            {submission.problems?.difficulty && (
              <Badge
                className={cn('w-fit', {
                  'bg-red-500/10 text-red-500 hover:bg-red-500/10':
                    submission.problems?.difficulty === 'hard',
                  'bg-green-500/10 text-green-500 hover:bg-green-500/10':
                    submission.problems?.difficulty === 'easy',
                  'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10':
                    submission.problems?.difficulty === 'medium',
                })}
              >
                {getDifficultyInPortuguese({
                  difficulty: submission.problems?.difficulty,
                })}
              </Badge>
            )}
          </div>
          <p className="text-sm">{submission.problems?.description}</p>
        </div>
      ))}
    </section>
  )
}

export default CompletedProblems
