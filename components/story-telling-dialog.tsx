'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Character, StoryTellig } from '@/db/custom-types'
import TypingAnimation from './magic-ui/typing-animation'
import Meteors from './magic-ui/meteors'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { parseAsInteger, useQueryState } from 'nuqs'

interface StoryTellingDialogProps {
  storyTelling: StoryTellig
  character: Character
}

const StoryTellingDialog = ({
  character,
  storyTelling,
}: StoryTellingDialogProps) => {
  const [open, setOpen] = useState(true)
  const [currentStory, setCurrentStory] = useQueryState(
    'currentStory',
    parseAsInteger.withDefault(0),
  )
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-screen max-w-screen-lg">
        <div className="relative flex flex-col items-center justify-start gap-4 overflow-hidden p-4">
          <Meteors number={100} />
          <Image
            src={character.image ?? ''}
            alt={character.name ?? ''}
            width={400}
            height={400}
            className="z-50"
          />
          <DialogDescription>
            <TypingAnimation
              className="w-full text-justify text-lg font-medium"
              text={storyTelling.text ?? ''}
              duration={50}
            />
          </DialogDescription>
        </div>
        <DialogFooter>
          <div
            className={cn('flex w-full items-center justify-between', {
              'justify-end': currentStory === 0,
            })}
          >
            {' '}
            {currentStory > 0 && (
              <Button
                onClick={() => setCurrentStory(currentStory - 1)}
                variant={'outline'}
                size={'sm'}
              >
                Voltar
              </Button>
            )}
            <Button
              onClick={() => setCurrentStory(currentStory + 1)}
              size={'sm'}
              className="float-end"
            >
              Continuar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default StoryTellingDialog
