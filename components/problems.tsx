'use client'
import { getCurrentProblemId, getProblems } from '@/app/actions/problems'
import { getLastProblemIdCompletedByUser } from '@/app/actions/submissions'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

const Problems = () => {
  const { data: problems } = useQuery({
    queryKey: ['problems'],
    queryFn: () => getProblems(),
  })

  const { data: currentProblemId } = useQuery({
    queryKey: ['currentProblemId'],
    queryFn: () => getCurrentProblemId(),
  })

  const { data: lastProblemIdCompletedByUser } = useQuery({
    queryKey: ['lastProblemIdCompletedByUser'],
    queryFn: () => getLastProblemIdCompletedByUser(),
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
