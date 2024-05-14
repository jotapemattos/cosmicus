'use client'

import { Editor } from '@monaco-editor/react'
import { Button } from './ui/button'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getProblemById } from '@/data/problems'
import { getTestCasesByProblemId } from '@/data/test-cases'

interface EditorProps {
  problemId: number
}

const CodePlayground: React.FC<EditorProps> = ({ problemId }: EditorProps) => {
  const { data: problem } = useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => getProblemById({ problemId }),
  })

  const { data: testCases } = useQuery({
    queryKey: ['testCases', problemId],
    queryFn: () => getTestCasesByProblemId({ problemId }),
  })
  const [code, setCode] = useState(problem?.initial_value ?? '')
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
                    content: `${code} ${execution}`,
                  },
                ],
              }),
            },
          )
          const { run: result } = await response.json()
          if (result.stderr) {
            throw new Error('Não foi possivel executar o código')
          }
          const newTestCases = result.stdout.split('\n') as string[]

          setCodeResults(newTestCases)
          setOutput(result.stdout.split('\n'))
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })
    }
  }

  return (
    <section className="flex w-screen gap-8">
      <Editor
        height="80vh"
        width={'50vw'}
        defaultLanguage="javascript"
        defaultValue={code + '\n}'}
        onChange={handleOnChange}
        theme="vs-dark"
      />
      <Button disabled={isPending} onClick={handleClick}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar'}
      </Button>
      <p>{output}</p>
    </section>
  )
}

export default CodePlayground
