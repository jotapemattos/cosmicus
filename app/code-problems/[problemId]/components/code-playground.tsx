'use client'

import TokyoNightStorm from '@/utils/editor-themes/tokyo-night-storm.json'
import { Editor, type Monaco } from '@monaco-editor/react'
import { Button } from '../../../../components/ui/button'
import { Coins, Loader2, Sparkles } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getProblemById } from '@/app/actions/problems'
import { getTestCasesByProblemId } from '@/app/actions/test-cases'
import useCodePlayground from '@/hooks/use-code-playground'
import {
  createSubmission,
  getSubmissionByProblemIdAndProfileId,
  updateSubmission,
} from '@/app/actions/submissions'
import TestCases from '../../../../components/test-cases'
import ProblemCompletedDialog from '@/app/code-problems/[problemId]/components/problem-completed-dialog'
import Perks from './perks'
import { useParams } from 'next/navigation'
import { UsePerks } from '@/hooks/use-perks'

interface EditorProps {
  userId: string
}

const CodePlayground: React.FC<EditorProps> = ({ userId }: EditorProps) => {
  const params = useParams<{ problemId: string }>()
  const problemId = Number(params.problemId)
  const { usedPerks } = UsePerks({ userId, problemId })

  const hasUsedSpecialHint = usedPerks[1] || false
  // const hasUsedDoubleCoints = usedPerks[2] || false

  const handleEditorDidMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('TokyoNightStorm', {
      base: 'vs-dark',
      inherit: true,
      ...TokyoNightStorm,
      rules: [],
    })
  }

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
    usedPerks,
  })

  if (testCases === undefined || problem === undefined) return

  return (
    <main className="mx-auto mb-20 mt-32 flex w-full max-w-screen-2xl flex-col items-center gap-8">
      <header className="flex w-full items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">{problem.name}</h1>
        <span className="text-xl">Categoria - {problem.category}</span>
        <hr className="h-6 w-px bg-white" />
        <div className="flex items-center gap-2">
          <Coins className="size-4" />
          <span>{problem.coins_reward}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="size-4" />
          <span>{problem.experience_reward}</span>
        </div>
        <hr className="h-6 w-px bg-white" />
        <Perks userId={userId} />
      </header>
      <div className="flex w-full justify-between gap-4">
        <aside className="space-y-4">
          <p>{problem.description}</p>
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
            <h3 className="text-md font-bold">Dica</h3>
            <div
              dangerouslySetInnerHTML={{ __html: problem.hint as string }}
              className="prose max-w-2/3 prose-code:rounded-md prose-code:bg-secondary prose-code:p-2 prose-code:text-sm prose-code:text-violet-500"
            />
          </div>
          {hasUsedSpecialHint && (
            <div>
              <h3 className="text-md font-bold">Dica Especial</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: problem.special_hint as string,
                }}
                className="prose max-w-2/3 prose-code:rounded-md prose-code:bg-secondary prose-code:p-2 prose-code:text-sm prose-code:text-violet-500"
              />
            </div>
          )}
        </aside>
        <div className="flex flex-col gap-2">
          <Editor
            height={'60vh'}
            width={'40vw'}
            defaultLanguage="python"
            defaultValue={
              submission
                ? (submission.code as string)
                : (problem.initial_value as string)
            }
            onChange={prop?.handleOnChange}
            theme="TokyoNightStorm"
            beforeMount={handleEditorDidMount}
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-4">
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
      {prop?.codeResults && (
        <TestCases
          input={testCases.map((item) => item.input as string)}
          expectedOutputs={testCases.map(
            (item) => item.expected_output as string,
          )}
          receivedOutputs={prop?.codeResults as string[]}
        />
      )}
      {prop?.hasCompleted && <ProblemCompletedDialog problemId={problem.id} />}
    </main>
  )
}

export default CodePlayground
