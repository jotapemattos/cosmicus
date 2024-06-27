'use client'

import { Editor } from '@monaco-editor/react'
import { Button } from './ui/button'
import { Coins, Loader2 } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getProblemById } from '@/data/problems'
import { getTestCasesByProblemId } from '@/data/test-cases'
import useCodePlayground from '@/hooks/use-code-playground'
import { createSubmission } from '@/data/submissions'

interface EditorProps {
  problemId: number
  userId: string
}

const CodePlayground: React.FC<EditorProps> = ({
  problemId,
  userId,
}: EditorProps) => {
  const { data: problem } = useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => getProblemById({ problemId }),
  })

  const { data: testCases } = useQuery({
    queryKey: ['testCases', problemId],
    queryFn: () => getTestCasesByProblemId({ problemId }),
  })

  const { mutateAsync: createSubmissionFn } = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      console.log('god gau')
    },
  })

  const prop = useCodePlayground({
    testCases,
    problem,
    createSubmissionFn,
    userId,
  })

  if (testCases === undefined || problem === undefined) return

  return (
    <section className="mt-24 w-full max-w-screen-2xl space-y-12">
      <div className="flex w-full justify-end">
        <Button
          disabled={prop?.isPending}
          onClick={prop?.handleClick}
          className="bg-green-500/10 text-green-500 hover:bg-green-500/15"
        >
          {prop?.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Enviar'
          )}
        </Button>
      </div>

      {/* <p>{prop?.output}</p> */}
      <div className="flex w-full justify-between">
        <aside className="space-y-4">
          <h1 className="text-3xl font-bold">{problem.name}</h1>
          <p>{problem.description}</p>
          <div className="flex items-center gap-4">
            <div>
              <Coins />
              <p>{problem.coins_reward}</p>
            </div>
          </div>
          {testCases.map((testCase) => (
            <div key={testCase.id}>
              <p>{testCase.execution}</p>
              <p>{testCase.expected_output}</p>
            </div>
          ))}
        </aside>
        <Editor
          height="80vh"
          width={'50vw'}
          defaultLanguage="python"
          defaultValue={problem?.initial_value + '\n'}
          onChange={prop?.handleOnChange}
          theme="vs-dark"
        />
      </div>
    </section>
  )
}

export default CodePlayground
