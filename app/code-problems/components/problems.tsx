'use client'
import { getCurrentProblemId, getProblems } from '@/app/actions/problems'
import { getLastProblemIdCompletedByUser } from '@/app/actions/submissions'
import { groupProblemsByDifficulty } from '@/utils/group-problems-by-difficulty'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getUserSkin } from '@/app/actions/skins'
import { getUserProfile } from '@/app/actions/profile'
import ProblemCard from './problem-card'
import Image from 'next/image'
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
import { Separator } from '@/components/ui/separator'
import { getDifficultyInPortuguese } from '@/lib/get-difficulty-in-portuguese'
import { Skeleton } from '@/components/ui/skeleton'

type Difficulty = 'easy' | 'hard' | 'medium'

const ProblemsSkeleton = () => {
  return (
    <>
      <section className="mx-auto flex w-full flex-wrap items-center gap-4 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        {/* Streak Card Skeleton */}
        <Skeleton className="flex h-[350px] w-96  rounded-xl" />

        {/* Mini Games Card Skeleton */}
        <Skeleton className="flex h-[350px] w-96  rounded-xl" />
      </section>

      <section className="mx-auto flex w-full flex-col-reverse items-center gap-12 md:max-w-screen-md md:flex-row md:items-start md:px-0 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex w-full flex-col gap-52">
          {/* Difficulty Groups Skeleton */}
          {['easy', 'medium', 'hard'].map((difficulty) => (
            <div
              key={difficulty}
              className="w-full space-y-16 overflow-x-hidden"
            >
              {/* Difficulty Separator */}
              <div className="flex items-center justify-center">
                <Separator />
                <Skeleton className="mx-4 h-6 w-48" />
                <Separator />
              </div>

              {/* Problem Cards Skeleton */}
              {Array.from({ length: 15 }, (_, index) => (
                <Skeleton className="flex h-[250px] w-full" key={index} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

const Problems = () => {
  const { data: problems, isLoading: isProblemsLoading } = useQuery({
    queryKey: ['problems'],
    queryFn: () => getProblems(),
  })

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getUserProfile(),
  })

  const { data: skin, isLoading: isSkinLoading } = useQuery({
    queryKey: ['skin'],
    queryFn: () => getUserSkin(),
  })

  const { data: currentProblemId, isLoading: isCurrentProblemIdLoading } =
    useQuery({
      queryKey: ['currentProblemId'],
      queryFn: () => getCurrentProblemId(),
    })

  const {
    data: lastProblemIdCompletedByUser,
    isLoading: isLastProblemIdLoading,
  } = useQuery({
    queryKey: ['lastProblemIdCompletedByUser'],
    queryFn: () => getLastProblemIdCompletedByUser(),
  })

  const grouppedProblems = useMemo(() => {
    return groupProblemsByDifficulty(problems ?? [])
  }, [problems])

  const isLoading =
    isCurrentProblemIdLoading ||
    isLastProblemIdLoading ||
    isProblemsLoading ||
    isProfileLoading ||
    isSkinLoading ||
    problems === undefined ||
    lastProblemIdCompletedByUser === undefined ||
    skin === undefined ||
    profile === undefined

  if (isLoading) {
    return <ProblemsSkeleton />
  }

  return (
    <>
      <section className="mx-auto flex w-full flex-wrap items-center gap-4 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        {profile && profile.streak >= 3 && (
          <Card className="flex h-[350px] w-96 flex-col items-center rounded-xl bg-gradient-to-tr from-orange-500 to-orange-600">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Parabéns!!</CardTitle>
            </CardHeader>
            <CardContent className="flex h-full items-center">
              <Flame />
            </CardContent>
            <CardFooter className="mt-auto">
              <p className="text-center text-white">
                Você está em uma sequência de <strong>{profile.streak}</strong>{' '}
                acertos consecutivos.
              </p>
            </CardFooter>
          </Card>
        )}
        <Card className="flex h-[350px] w-96 flex-col items-center rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700">
          <CardHeader>
            <CardTitle>Precisa de mais moedas?</CardTitle>
            <CardDescription className="text-white">
              Você também pode completar{' '}
              <strong className="text-white">mini jogos</strong> para ganhar
              mais moedas e pontos de experiência.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image
              src={'/3d-planet.png'}
              alt="Imagem de um planeta"
              width={120}
              height={120}
            />
          </CardContent>
          <CardFooter className="mt-auto w-full">
            <Button
              asChild
              className="w-full bg-indigo-100 text-background hover:bg-indigo-100/90"
            >
              <Link href="ct-problems">Ver mini jogos</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
      <section className="mx-auto flex w-full flex-col-reverse items-center gap-12 md:max-w-screen-md md:flex-row md:items-start md:px-0 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex w-full flex-col gap-52">
          {grouppedProblems.map((group) => (
            <div
              key={group.difficulty}
              className="w-full space-y-16 overflow-x-hidden"
            >
              <div className="flex items-center justify-center">
                <Separator />
                <div className="mx-4 whitespace-nowrap font-bold text-muted-foreground">
                  Problemas de nível{' '}
                  {getDifficultyInPortuguese({
                    difficulty: group.difficulty as Difficulty,
                  })}
                </div>
                <Separator />
              </div>
              {group.problems.map((problem) => (
                <>
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    lastProblemIdCompletedByUser={
                      lastProblemIdCompletedByUser as number
                    }
                    currentProblemId={currentProblemId as number}
                    skin={skin}
                  />
                </>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Problems
