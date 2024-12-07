'use client'

// import dracula from '@/utils/editor-themes/dracula.json'
import { Editor, type Monaco } from '@monaco-editor/react'
import { Button } from '../../../../components/ui/button'
import { Loader2, Play } from 'lucide-react'
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
import DifficultyBadge from '@/components/ui/difficulty-badge'
import Coin from '@/components/icons/coin'
import Star from '@/components/icons/star'
import ProblemTopics from './problem-topics'
import { Skeleton } from '@/components/ui/skeleton'
import ProblemTimer from './problem-timer'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula as draculaSyntax } from 'react-syntax-highlighter/dist/esm/styles/prism'
import dracula from '@/utils/editor-themes/dracula.json'

interface EditorProps {
  userId: string
}

const CodePlayGroundSkeleton = () => {
  return (
    <main className="mx-auto my-20 flex w-full max-w-screen-2xl flex-col items-center gap-8">
      <header className="flex w-full items-center justify-center gap-4">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </header>
      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row">
        <aside className="w-full space-y-4">
          <Skeleton className="h-12 w-24" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-10" />
            <div className="flex items-center gap-2">
              <Coin />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex items-center gap-2">
              <Star />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
          <Skeleton className="h-6 w-72" />
          {/* Showing only first two test cases */}
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-6 w-72" />
          <div>
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-6 w-72" />
          </div>
          <Skeleton className="h-12 w-full" />
        </aside>
        <div className="flex w-full max-w-3xl flex-col gap-2">
          <Skeleton className="h-[60vh] w-full" />
        </div>
      </div>
    </main>
  )
}

const CodePlayground: React.FC<EditorProps> = ({ userId }: EditorProps) => {
  const params = useParams<{ problemId: string }>()
  const problemId = Number(params.problemId)
  const { usedPerks } = UsePerks({ userId, problemId })

  const hasUsedSpecialHint = usedPerks[1] || false
  // const hasUsedDoubleCoints = usedPerks[2] || false
  const hasFrozenTimer = usedPerks[4] || false

  const handleEditorDidMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('Dracula', {
      base: 'vs-dark', // Use one of the built-in base themes
      inherit: true,
      rules: [
        // Your custom color rules from the dracula.json
        ...dracula.rules.map((rule) => ({
          token: rule.token,
          foreground: rule.foreground,
          background: rule.background,
          fontStyle: rule.fontStyle,
        })),
      ],
      colors: dracula.colors,
    })
    monaco.editor.setTheme('Dracula')
  }

  const { data: problem, isLoading: isProblemLoading } = useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => getProblemById({ problemId }),
  })

  const { data: testCases, isLoading: isTestCasesLoading } = useQuery({
    queryKey: ['testCases', problemId],
    queryFn: () => getTestCasesByProblemId({ problemId }),
  })

  const { data: submission, isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ['submissions', problemId, userId],
    queryFn: () => getSubmissionByProblemIdAndProfileId({ problemId }),
  })

  const isLoading =
    isProblemLoading || isTestCasesLoading || isSubmissionsLoading

  const { mutateAsync: createSubmissionFn } = useMutation({
    mutationFn: createSubmission,
  })

  const { mutateAsync: updateSubmissionFn } = useMutation({
    mutationFn: updateSubmission,
  })

  const prop = useCodePlayground({
    testCases,
    problem,
    createSubmissionFn,
    userId,
    updateSubmissionFn,
    usedPerks,
  })

  if (isLoading) {
    return <CodePlayGroundSkeleton />
  }

  if (testCases === undefined || problem === undefined) return

  return (
    <main className="mx-auto my-20 flex w-full max-w-screen-2xl flex-col items-center gap-8">
      <header className="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
        <ProblemTimer
          userId={userId}
          problemId={problem.id}
          hasFrozenTimer={hasFrozenTimer}
        />
        <div className="flex w-full flex-col items-center gap-4 md:w-fit md:flex-row">
          <Button
            disabled={prop?.isPending}
            onClick={prop?.handleClick}
            variant={'secondary'}
            className="w-full md:w-fit"
          >
            {prop?.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Play className="text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Executar</span>
              </>
            )}
          </Button>
          <div className="flex items-center gap-4">
            <Perks userId={userId} />
          </div>
        </div>
      </header>
      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row">
        <aside className="w-full space-y-4">
          <h1 className="text-3xl font-bold">{problem.name}</h1>
          <div className="flex items-center gap-4">
            <DifficultyBadge difficulty={problem.difficulty} />
            <div className="flex items-center gap-2">
              <Coin />
              <p className="text-muted-foreground">{problem.coins_reward}</p>
            </div>
            <div className="flex items-center gap-2">
              <Star />
              <p className="text-muted-foreground">
                {problem.experience_reward}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground">{problem.description}</p>
          {/* Showing only first two test cases */}
          {testCases.map(
            (testCase, index) =>
              index <= 1 && (
                <div key={testCase.id} className="prose">
                  <div>
                    <div className="flex items-center gap-4">
                      <h3 className="text-md font-medium">Entrada:</h3>
                      <p className="text-muted-foreground">{testCase.input}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <h3 className="text-md font-medium">Saída Esperada:</h3>
                      <p className="text-muted-foreground">
                        {testCase.expected_output}
                      </p>
                    </div>
                  </div>
                </div>
              ),
          )}
          <div>
            <h3 className="text-md font-bold">Dica</h3>
            {/* <div
              dangerouslySetInnerHTML={{ __html: problem.hint as string }}
              className="prose max-w-2/3 leading-10 text-muted-foreground prose-code:rounded-md prose-code:bg-secondary prose-code:p-2 prose-code:text-sm prose-code:text-violet-500"
            /> */}
            <SyntaxHighlighter language="python" style={draculaSyntax}>
              {(problem.hint as string).trim()}
            </SyntaxHighlighter>
          </div>
          {hasUsedSpecialHint && (
            <div>
              <h3 className="text-md font-bold">Dica Especial</h3>
              <SyntaxHighlighter language="python" style={draculaSyntax}>
                {(problem.special_hint as string).trim()}
              </SyntaxHighlighter>
            </div>
          )}
          <ProblemTopics topics={problem.topics} />
        </aside>
        <div className="flex w-full max-w-3xl flex-col gap-2">
          <Editor
            height={'60vh'}
            // width={'40vw'}
            defaultLanguage="python"
            defaultValue={
              submission
                ? (submission.code as string)
                : (problem.initial_value as string)
            }
            onChange={prop?.handleOnChange}
            theme="Dracula"
            beforeMount={handleEditorDidMount}
            className="w-full"
          />
        </div>
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
