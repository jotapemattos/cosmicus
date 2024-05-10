'use client'

import { Editor } from '@monaco-editor/react'
import { Button } from './ui/button'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface EditorProps {
  value?: string // Optional initial value for the editor
  onChange?: (newValue: string) => void // Callback for value changes
}

interface TestCases {
  execution: string
  expectedOutput: string
}

interface Problem {
  name: string
  initialValue: string
  testCases: TestCases[]
}

const CodePlayground: React.FC<EditorProps> = ({ value }) => {
  const problem: Problem = {
    name: 'Problema de soma',
    initialValue: 'function soma(array) {\n',
    testCases: [
      {
        execution: 'console.log(soma([1,2,3]))',
        expectedOutput: '[1,2,3]',
      },
      /*  {
        execution: 'console.log(soma(10, 10))',
        expectedOutput: '20',
      },
      {
        execution: 'console.log(soma(0, 0))',
        expectedOutput: '0',
      },
      {
        execution: 'console.log(soma(-1, -1))',
        expectedOutput: '-2',
      }, */
    ],
  }
  const [code, setCode] = useState(problem.initialValue)
  const [output, setOutput] = useState(null)
  const [isPending, startTransition] = useTransition()
  const [testCases, setTestCases] = useState<string[]>([])

  const handleOnChange = (value?: string) => {
    setCode(value || '')
  }

  const execution = problem.testCases.map((test) => test.execution).join('\n')

  const handleClick = () => {
    if (code.includes(problem.initialValue.trim())) {
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
                language: 'javascript',
                version: '18.15.0',
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

          setTestCases(newTestCases)
          setOutput(result.stdout.split('\n'))
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })
    }
  }

  useEffect(() => {
    let isValidCode = true

    for (let i = 0; i < problem.testCases.length; i++) {
      if (problem.testCases[i].expectedOutput !== testCases[i]) {
        console.log({
          expected: problem.testCases[i].expectedOutput,
          actual: testCases[i],
        })
        isValidCode = false
      }
    }

    if (isValidCode) {
      toast.success('Coisa linda')
      return
    }

    toast.error('Codigo errado')

    // eslint-disable-next-line
  }, [testCases])

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
