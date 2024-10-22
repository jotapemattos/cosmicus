import {
  CreateSubmissionRequest,
  UpdateSubmissionRequest,
  hasCompletedProblem,
} from '@/app/actions/submissions'
import { Problem, TestCase } from '@/db/custom-types'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useSoundEffects } from './use-sound-effects'

interface UseCodePlaygroundProps {
  testCases: TestCase[] | undefined
  problem: Problem | undefined
  createSubmissionFn: UseMutateAsyncFunction<
    {
      code: string | null
      created_at: string
      has_concluded: boolean | null
      id: number
      problem_id: number | null
      profile_id: string
      time_in_seconds: number | null
    } | null,
    Error,
    CreateSubmissionRequest,
    unknown
  >
  userId: string
  updateSubmissionFn: UseMutateAsyncFunction<
    void,
    Error,
    UpdateSubmissionRequest,
    unknown
  >
  usedPerks: Record<number, boolean>
}

interface ReturnedTestCases {
  expected_output: string
  received_output: string
  input: string
}

export default function useCodePlayground({
  testCases,
  problem,
  createSubmissionFn,
  updateSubmissionFn,
  usedPerks,
}: UseCodePlaygroundProps) {
  const [code, setCode] = useState('')
  const [isPending, startTransition] = useTransition()
  const [codeResults, setCodeResults] = useState<string[] | null>(null)
  const [returnedTestCases, setReturnedTestCases] = useState<
    ReturnedTestCases[]
  >([])
  const [hasCompleted, setHasCompleted] = useState(false)
  const [isFirstTry, setIsFirstTry] = useState(true)
  const { playSuccess, playError, playClick } = useSoundEffects() // Add this line

  const handleOnChange = (value?: string) => {
    setCode(value || '')
  }

  const handleSubmission = async () => {
    if (problem !== undefined) {
      try {
        const isProblemCompleted = await hasCompletedProblem({
          problemId: problem.id,
        })

        if (isProblemCompleted) {
          await updateSubmissionFn({
            problemId: problem.id,
            code,
          })
          playSuccess() // Add success sound
          return
        }

        const hasUsedDoubleCoins = usedPerks[2] || false
        const hasUsedDoubleExperience = usedPerks[3] || false

        const createdSubmisstion = await createSubmissionFn({
          problemId: problem.id,
          code,
          hasDoubleCoins: hasUsedDoubleCoins,
          hasDoubleExperience: hasUsedDoubleExperience,
          difficulty: problem.difficulty,
          timeInSeconds: 60,
          isFirstTry,
        })

        if (createdSubmisstion) {
          setHasCompleted(true)
          playSuccess() // Add success sound
        }
      } catch (error) {
        playError() // Add error sound
        throw error
      }
    }
  }

  useEffect(() => {
    if (codeResults) {
      let isValidCode = true
      if (testCases) {
        for (let i = 0; i < testCases.length; i++) {
          if (testCases[i].expected_output !== codeResults[i]) {
            setReturnedTestCases((prev) => [
              ...prev,
              {
                expected_output: testCases![i].expected_output as string,
                received_output: codeResults[i],
                input: testCases![i].input as string,
              },
            ])

            isValidCode = false
          }
        }
      }
      if (isValidCode) {
        handleSubmission()
        return
      }

      setIsFirstTry(false)
      playError() // Add error sound
      toast.error('Código errado')
    }

    // eslint-disable-next-line
  }, [codeResults])

  if (testCases === undefined || problem === undefined) return
  const execution = testCases.map((test) => test.execution).join('\n')

  const handleClick = () => {
    playClick() // Add click sound
    console.log(code)
    if (code?.includes(problem.initial_value!.trim())) {
      startTransition(async () => {
        try {
          const response = await fetch(
            'https://emkc.org/api/v2/piston/execute',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                language: 'python',
                version: '3.10.0',
                files: [
                  {
                    content: `${code}\n${execution}`,
                  },
                ],
              }),
            },
          )
          const { run: result } = await response.json()
          if (result.stderr) {
            console.log(result.stderr)
            playError() // Add error sound
            throw new Error('Não foi possivel executar o código')
          }
          const newCodeResults = result.stdout.split('\n') as string[]

          setCodeResults(newCodeResults)
        } catch (error) {
          if (error instanceof Error) {
            playError() // Add error sound
            toast.error(error.message)
          }
        }
      })
    }
  }

  return {
    returnedTestCases,
    handleClick,
    handleOnChange,
    code,
    codeResults,
    isPending,
    hasCompleted,
  }
}
