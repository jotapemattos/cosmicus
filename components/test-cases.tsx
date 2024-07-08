'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface TestCasesProps {
  expectedOutputs: string[]
  receivedOutputs: string[]
}

const TestCases = ({ expectedOutputs, receivedOutputs }: TestCasesProps) => {
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
    <section className="my-24 space-y-8">
      <div className="flex items-center gap-4">
        {expectedOutputs.map((item, index) => (
          <Button
            key={item}
            onClick={() => setActiveIndex(index)}
            // variant={activeIndex === index ? 'default' : 'secondary'}
            className={cn({
              'bg-red-500/10 text-black transition-colors duration-300 hover:bg-red-500/20':
                expectedOutputs[index] !== receivedOutputs[index],
              'bg-green-500/10 text-black transition-colors duration-300 hover:bg-green-500/20':
                expectedOutputs[index] === receivedOutputs[index],
            })}
          >
            Teste {index + 1}
          </Button>
        ))}
      </div>
      <div
        className={cn('md w-wfull rounded p-4', {
          'bg-red-500/10': !isActiveTestCorrect(),
          'bg-green-500/10': isActiveTestCorrect(),
        })}
        id="test-cases"
      >
        <p>
          <strong>Esperado:</strong>
          {expectedOutputs.filter((_, index) => index === activeIndex)}
        </p>
        <p>
          <strong>Recebido:</strong>
          {receivedOutputs.filter((_, index) => index === activeIndex)}
        </p>
      </div>
    </section>
  )
}

export default TestCases
