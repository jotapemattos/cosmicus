'use client'
import { getCurrentProblemId, getProblems } from '@/app/actions/problems'
import { getLastProblemIdCompletedByUser } from '@/app/actions/submissions'
import { groupProblemsByDifficulty } from '@/utils/group-problems-by-difficulty'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getUserSkin } from '@/app/actions/skins'
import { getUserProfile } from '@/app/actions/profile'
import ProblemPopover from './problem-popover'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Flame from '@/components/icons/flame'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
    <section className="mx-auto flex w-full max-w-screen-2xl gap-2">
      <div className="fixed">
        <Image
          src={skin?.picture ?? '/default-skin.png'}
          alt="Imagem de Skin"
          width={300}
          height={300}
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-20 overflow-y-scroll">
        {grouppedProblems.map((group) => (
          <div key={group.difficulty} className="my-32">
            {group.problems.map((problem, problemIndex) => (
              <>
                <ProblemPopover
                  key={problem.id}
                  problem={problem}
                  lastProblemIdCompletedByUser={
                    lastProblemIdCompletedByUser as number
                  }
                  currentProblemId={currentProblemId as number}
                  className={cn('relative', {
                    'left-0 ':
                      (problemIndex + 1) % 5 === 1 ||
                      (problemIndex + 1) % 5 === 0, // Center (first and last)
                    // 'left-24 bg-green-500': (problemIndex + 1) % 5 === 3, // First curve out
                    'left-36 ':
                      (problemIndex + 1) % 5 === 2 ||
                      (problemIndex + 1) % 5 === 4, // Maximum curve
                    'left-72': (problemIndex + 1) % 5 === 3, // Maximum curve
                  })}
                />
              </>
            ))}
          </div>
        ))}
      </div>
      {/* <ProblemInfos streak={profile?.streak as number} /> */}
      <aside className=" space-y-10">
        {profile && profile.streak >= 3 && (
          <Card className="flex h-72 w-96 flex-col items-center rounded-xl bg-gradient-to-tr from-background via-background to-orange-500/20">
            <CardHeader>
              <CardTitle className="inline-block bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                Parabéns!!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Flame />
            </CardContent>
            <CardFooter>
              <p className="text-center text-muted-foreground">
                Você está em uma sequência de{' '}
                <strong className="text-white">{profile.streak}</strong> acertos
                consecutivos.
              </p>
            </CardFooter>
          </Card>
        )}
        <Card className="flex w-96 flex-col items-center rounded-xl bg-gradient-to-tr from-background via-background to-indigo-500/20">
          <CardHeader>
            <CardTitle>Precisa de mais moedas?</CardTitle>
            <CardDescription>
              Você também pode completar{' '}
              <strong className="text-white">mini jogos</strong> para ganhar
              mais moedas e pontos de experiência.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image
              src={'/3d-planet.png'}
              alt="Imagem de um planeta"
              width={150}
              height={150}
            />
          </CardContent>
          <CardFooter className="w-full">
            <Button asChild className="w-full">
              <Link href="ct-problems">Ver mini jogos</Link>
            </Button>
          </CardFooter>
        </Card>
      </aside>
    </section>
  )
}

export default Problems
