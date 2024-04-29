'use client'

import { Editor } from '@monaco-editor/react'
import { Button } from './ui/button'
import { useState } from 'react'

interface EditorProps {
  value?: string // Optional initial value for the editor
  onChange?: (newValue: string) => void // Callback for value changes
}

const CodePlayground: React.FC<EditorProps> = ({
  value = '// some comment',
  onChange,
}) => {
  const [code, setCode] = useState(value)

  const handleOnChange = (value?: string) => {
    setCode(value || '')
  }

  const handleClick = async () => {
    // Make a POST request to the Piston API with the code
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'javascript',
        version: '15.10.0',
        files: [
          {
            name: 'test.js',
            content: code,
          },
        ],
      }),
    })

    // Handle the response
    if (response.ok) {
      const data = await response.json()
      console.log('Piston API response:', data)
      // You can further process the data here, like displaying the output
    } else {
      console.error('Error making request to Piston API:', response.statusText)
    }
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
      <Button onClick={handleClick}>Enviar</Button>
    </section>
  )
}

export default CodePlayground
