'use client'
import { getCurrentProblemId, getProblems } from '@/app/actions/problems'
import { getLastProblemIdCompletedByUser } from '@/app/actions/submissions'
import { groupProblemsByDifficulty } from '@/utils/group-problems-by-difficulty'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import ProblemPopover from './problem-popover'

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

  const grouppedProblems = useMemo(() => {
    return groupProblemsByDifficulty(problems ?? [])
  }, [problems])

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {grouppedProblems.map((item) => (
        <div key={item.difficulty} className="my-12 flex flex-col gap-8">
          {item.problems.map((problem) => (
            <ProblemPopover
              key={problem.id}
              problem={problem}
              lastProblemIdCompletedByUser={
                lastProblemIdCompletedByUser as number
              }
              currentProblemId={currentProblemId as number}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Problems
