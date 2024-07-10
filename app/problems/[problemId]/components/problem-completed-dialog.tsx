'use client'

import NumberTicker from '@/components/magic-ui/number-ticker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getProfileByUserId } from '@/data/profile'
import { Problem } from '@/db/custom-types'
import { useQuery } from '@tanstack/react-query'
import { Coins, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProblemCompletedDialogProps {
  userId: string
  problem: Problem
}

const ProblemCompletedDialog = ({
  userId,
  problem,
}: ProblemCompletedDialogProps) => {
  const [open, setOpen] = useState(true)

  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfileByUserId({ userId }),
  })

  useEffect(() => {
    const end = Date.now() + 3 * 1000 // 3 seconds
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']

    const frame = () => {
      if (Date.now() > end) return

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      })

      requestAnimationFrame(frame)
    }

    frame()
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Missão concluída com sucesso!</DialogTitle>
          <DialogDescription>
            Muito bem, {profile?.username}...
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins />
            <h2 className="text-3xl font-bold">
              <NumberTicker
                defaultValue={profile?.coins_amount as number}
                value={problem.coins_reward as number}
              />
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Star />
            <h2 className="text-3xl font-bold">
              <NumberTicker
                defaultValue={profile?.experience_points as number}
                value={problem.experience_reward as number}
              />
            </h2>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-4">
          <Button asChild variant={'secondary'}>
            <Link href="/">Voltar para o mapa</Link>
          </Button>
          <Button asChild>
            <Link href={`${problem.id + 1}`}>Continuar</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProblemCompletedDialog
