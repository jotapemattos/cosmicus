import { Problem, TestCase } from '@/db/custom-types'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

interface UseCodePlaygroundProps {
  testCases: TestCase[] | undefined
  problem: Problem | undefined
}

export default function useCodePlayground({
  testCases,
  problem,
}: UseCodePlaygroundProps) {
  const [code, setCode] = useState('')
  const [output, setOutput] = useState(null)
  const [isPending, startTransition] = useTransition()
  const [codeResults, setCodeResults] = useState<string[]>([])

  const handleOnChange = (value?: string) => {
    setCode(value || '')
  }
  useEffect(() => {
    let isValidCode = true
    // TODO - resolve testCases is possibly undefined
    if (testCases) {
      for (let i = 0; i < testCases.length; i++) {
        if (testCases[i].expected_output !== codeResults[i]) {
          console.log({
            expected: testCases![i].expected_output,
            actual: codeResults[i],
          })
          isValidCode = false
        }
      }
    }
    if (isValidCode) {
      toast.success('Coisa linda')
      return
    }

    toast.error('Codigo errado')

    // eslint-disable-next-line
  }, [codeResults])

  if (testCases === undefined || problem === undefined) return
  const execution = testCases.map((test) => test.execution).join('\n')

  const handleClick = () => {
    if (code?.includes(problem.initial_value.trim())) {
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
          setOutput(result.stdout.split('\n'))
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })
    }
  }

  return {
    handleClick,
    handleOnChange,
    code,
    output,
    isPending,
  }
}
