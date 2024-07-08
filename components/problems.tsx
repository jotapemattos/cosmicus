'use client'
import { getCurrentProblemId, getProblems } from '@/data/problems'
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

  return (
    <div className="flex items-center justify-center gap-4">
      {problems?.map((problem) => (
        <Link
          href={`problems/${problem.id}`}
          key={problem.id}
          className={cn('rounded-md bg-sky-400 p-4', {
            'bg-sky-950': currentProblemId === problem.id,
          })}
        >
          {problem.name}
        </Link>
      ))}
    </div>
  )
}

export default Problems
