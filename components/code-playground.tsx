'use client'

import { Editor } from '@monaco-editor/react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
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
    <section className="flex w-screen gap-8">
      <Editor
        height="80vh"
        width={'50vw'}
        defaultLanguage="python"
        defaultValue={problem?.initial_value + '\n'}
        onChange={prop?.handleOnChange}
        theme="vs-dark"
      />
      <Button disabled={prop?.isPending} onClick={prop?.handleClick}>
        {prop?.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Enviar'
        )}
      </Button>
      <p>{prop?.output}</p>
    </section>
  )
}

export default CodePlayground
