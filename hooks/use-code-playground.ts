import { CreateSubmissionRequest } from '@/data/submissions'
import { Problem, TestCase } from '@/db/custom-types'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

interface UseCodePlaygroundProps {
  testCases: TestCase[] | undefined
  problem: Problem | undefined
  createSubmissionFn: UseMutateAsyncFunction<
    void,
    Error,
    CreateSubmissionRequest,
    unknown
  >
  userId: string
  initialValue: string
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
  userId,
  initialValue,
}: UseCodePlaygroundProps) {
  const [code, setCode] = useState('')
  const [isPending, startTransition] = useTransition()
  const [codeResults, setCodeResults] = useState<string[] | null>(null)
  const [returnedTestCases, setReturnedTestCases] = useState<
    ReturnedTestCases[]
  >([])

  useEffect(() => {
    setCode(initialValue + '\n')
  }, [initialValue])

  const handleOnChange = (value?: string) => {
    setCode(value || '')
  }
  const handleSubmission = async () => {
    if (problem !== undefined) {
      await createSubmissionFn({
        problemId: problem.id,
        code,
        profileId: userId,
      })
    }
  }

  useEffect(() => {
    if (codeResults) {
      let isValidCode = true
      // TODO - resolve testCases is possibly undefined
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
        toast.success('Coisa linda')
        return
      }

      toast.error('Codigo errado')
    }

    // eslint-disable-next-line
  }, [codeResults])

  if (testCases === undefined || problem === undefined) return
  const execution = testCases.map((test) => test.execution).join('\n')

  const handleClick = () => {
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
            throw new Error('Não foi possivel executar o código')
          }
          const newCodeResults = result.stdout.split('\n') as string[]

          setCodeResults(newCodeResults)
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
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
  }
}
