'use client'
import { getCurrentProblemId, getProblems } from '@/app/actions/problems'
import { getLastProblemIdCompletedByUser } from '@/app/actions/submissions'
import { groupProblemsByDifficulty } from '@/utils/group-problems-by-difficulty'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getUserSkin } from '@/app/actions/skins'
import { Timeline } from '@/components/magic-ui/timeline'
import { Problem, Profile, Skin } from '@/db/custom-types'
import { getUserProfile } from '@/app/actions/profile'

const Problems = () => {
  const { data: problems } = useQuery({
    queryKey: ['problems'],
    queryFn: () => getProblems(),
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getUserProfile(),
  })

  const { data: skin } = useQuery({
    queryKey: ['skin'],
    queryFn: () => getUserSkin(),
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

  if (
    problems === undefined ||
    lastProblemIdCompletedByUser === undefined ||
    skin === undefined ||
    profile === undefined
  )
    return null

  return (
    <div className="w-full">
      <Timeline
        problems={problems as Problem[]}
        lastProblemIdCompletedByUser={lastProblemIdCompletedByUser}
        currentProblemId={currentProblemId as number}
        skin={skin}
        profile={profile as Profile}
      />
    </div>
  )
}

export default Problems
