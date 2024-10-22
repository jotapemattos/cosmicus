import React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface ProblemTopicsProps {
  topics: string[]
}

const ProblemTopics: React.FC<ProblemTopicsProps> = ({ topics }) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Image
              src="/book-topics.png"
              alt="Imagem de Livro"
              width={32}
              height={32}
            />
            Tópicos
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {topics.map((topic) => (
            <Badge key={topic} variant={'secondary'}>
              {topic}
            </Badge>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ProblemTopics
