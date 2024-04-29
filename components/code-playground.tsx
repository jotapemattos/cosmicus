'use client'

import { Editor } from '@monaco-editor/react'
import { Button } from './ui/button'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface EditorProps {
  value?: string // Optional initial value for the editor
  onChange?: (newValue: string) => void // Callback for value changes
}

const CodePlayground: React.FC<EditorProps> = ({
  value = '// some comment',
}) => {
  const [code, setCode] = useState(value)
  const [output, setOutput] = useState(null)
  const [isPending, startTransition] = useTransition()

  const handleOnChange = (value?: string) => {
    setCode(value || '')
  }

  const handleClick = () => {
    startTransition(async () => {
      try {
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: 'javascript',
            version: '18.15.0',
            files: [
              {
                content: code,
              },
            ],
          }),
        })
        const { run: result } = await response.json()
        if (result.stderr) {
          throw new Error('Não foi possivel executar o código')
        }
        setOutput(result.stdout.split('\n'))
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })
  }

  return (
    <section className="flex w-screen gap-8">
      <Editor
        height="80vh"
        width={'50vw'}
        defaultLanguage="javascript"
        defaultValue={value}
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
