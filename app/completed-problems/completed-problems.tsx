'use client'

import { getSubmissionsByProfileId } from '@/app/actions/submissions'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import DifficultyBadge from '@/components/ui/difficulty-badge'

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
          <Link
            href={`code-problems/${submission.problem_id}`}
            className="flex items-center gap-4"
          >
            <h3 className="text-xl font-bold">{submission.problems?.name}</h3>
            {submission.problems?.difficulty && (
              <DifficultyBadge difficulty={submission.problems.difficulty} />
            )}
          </Link>
          <p className="text-sm">{submission.problems?.description}</p>
        </div>
      ))}
    </section>
  )
}

export default CompletedProblems
