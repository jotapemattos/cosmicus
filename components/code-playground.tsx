'use client'

import { Editor } from '@monaco-editor/react'
import { Button } from './ui/button'
import { Coins, Loader2 } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getProblemById } from '@/app/actions/problems'
import { getTestCasesByProblemId } from '@/app/actions/test-cases'
import useCodePlayground from '@/hooks/use-code-playground'
import {
  createSubmission,
  getSubmissionByProblemIdAndProfileId,
  updateSubmission,
} from '@/app/actions/submissions'
import TestCases from './test-cases'
import ProblemCompletedDialog from '@/app/code-problems/[problemId]/components/problem-completed-dialog'

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

  const { data: submission } = useQuery({
    queryKey: ['submissions', problemId, userId],
    queryFn: () => getSubmissionByProblemIdAndProfileId({ problemId }),
  })

  const { mutateAsync: createSubmissionFn } = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      console.log('god gau')
    },
  })

  const { mutateAsync: updateSubmissionFn } = useMutation({
    mutationFn: updateSubmission,
    onSuccess: () => {
      console.log('god gau')
    },
  })

  const prop = useCodePlayground({
    testCases,
    problem,
    createSubmissionFn,
    userId,
    updateSubmissionFn,
  })

  if (testCases === undefined || problem === undefined) return

  return (
    <main className="mt-44 w-full max-w-screen-2xl space-y-12">
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

      <p>{prop?.codeResults}</p>
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
              <div className="flex items-center gap-4">
                <h3 className="text-md font-medium">Entrada:</h3>
                <p>{testCase.input}</p>
              </div>
              <div className="flex items-center gap-4">
                <h3 className="text-md font-medium">Saída Esperada:</h3>
                <p>{testCase.expected_output}</p>
              </div>
            </div>
          ))}
          <div>
            <h3 className="text-md font-medium">Dica</h3>
            <div
              dangerouslySetInnerHTML={{ __html: problem.hint as string }}
              className="prose max-w-2/3 prose-code:text-violet-500 prose-code:bg-secondary prose-code:p-2 prose-code:rounded-md prose-code:text-sm"
            />
          </div>
        </aside>
        <div className="flex flex-col gap-2">
          <Editor
            height="60vh"
            width={'50vw'}
            defaultLanguage="python"
            defaultValue={
              submission
                ? (submission.code as string)
                : (problem.initial_value as string)
            }
            onChange={prop?.handleOnChange}
            theme="vs-dark"
          />
          {prop?.returnedTestCases.map((item, i) => (
            <div key={i}>
              <p>input: {item.input}</p>
              <p>expected: {item.expected_output}</p>
              <p>receba: {item.received_output}</p>
            </div>
          ))}
        </div>
      </div>
      {prop?.codeResults && (
        <TestCases
          expectedOutputs={testCases.map(
            (item) => item.expected_output as string,
          )}
          receivedOutputs={prop?.codeResults as string[]}
        />
      )}
      {prop?.hasCompleted && (
        <ProblemCompletedDialog userId={userId} problemId={problem.id} />
      )}
    </main>
  )
}

export default CodePlayground
