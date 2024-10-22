'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface TestCasesProps {
  input: string[]
  expectedOutputs: string[]
  receivedOutputs: string[]
}

const TestCases = ({
  input,
  expectedOutputs,
  receivedOutputs,
}: TestCasesProps) => {
  // scroll to bottom to show the test-cases overview
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth',
  })

  const [activeIndex, setActiveIndex] = useState(0)

  const isActiveTestCorrect = () => {
    return expectedOutputs[activeIndex] === receivedOutputs[activeIndex]
  }
  return (
    <section className="w-full space-y-8">
      <div className="flex items-center gap-4">
        {expectedOutputs.map((item, index) => (
          <Button
            key={item}
            onClick={() => setActiveIndex(index)}
            className={cn({
              'bg-red-500/10 text-red-500 transition-colors duration-300 hover:bg-red-500/20':
                expectedOutputs[index] !== receivedOutputs[index],
              'bg-green-500/10 text-green-500 transition-colors duration-300 hover:bg-green-500/20':
                expectedOutputs[index] === receivedOutputs[index],
            })}
          >
            Teste {index + 1}
          </Button>
        ))}
      </div>
      <div
        className={cn('md w-full rounded p-4', {
          'bg-red-500/10': !isActiveTestCorrect(),
          'bg-green-500/10': isActiveTestCorrect(),
        })}
        id="test-cases"
      >
        <p className="text-muted-foreground">
          <strong className="text-white">Input: </strong>
          {input.filter((_, index) => index === activeIndex)}
        </p>
        <p className="text-muted-foreground">
          <strong className="text-white">Esperado: </strong>
          {expectedOutputs.filter((_, index) => index === activeIndex)}
        </p>
        <p className="text-muted-foreground">
          <strong className="text-white">Recebido: </strong>
          {receivedOutputs.filter((_, index) => index === activeIndex)}
        </p>
      </div>
    </section>
  )
}

export default TestCases
