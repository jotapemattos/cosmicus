'use client'
import { getCurrentProblemId, getProblems } from '@/data/problems'
import { getLastProblemIdCompletedByUser } from '@/data/submissions'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

interface PageProps {
  userId: string
}

const Problems = ({ userId }: PageProps) => {
  const { data: problems } = useQuery({
    queryKey: ['problems'],
    queryFn: () => getProblems(),
  })

  const { data: currentProblemId } = useQuery({
    queryKey: ['currentProblemId'],
    queryFn: () => getCurrentProblemId({ userId }),
  })

  const { data: lastProblemIdCompletedByUser } = useQuery({
    queryKey: ['lastProblemIdCompletedByUser'],
    queryFn: () => getLastProblemIdCompletedByUser({ profileId: userId }),
  })

  return (
    <div className="flex items-center justify-center gap-4">
      {problems?.map((problem) => (
        <Link
          href={
            // unable user to access a problem that it's not allowed
            problem.id <= (lastProblemIdCompletedByUser as number) + 1
              ? `problems/${problem.id}`
              : '/'
          }
          className={cn('rounded-md bg-sky-400 p-4', {
            'bg-sky-950': currentProblemId === problem.id,
          })}
          key={problem.id}
        >
          {problem.name}
        </Link>
      ))}
    </div>
  )
}

export default Problems
