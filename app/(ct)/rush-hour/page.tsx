'use client'

import type { NextPage } from 'next'

import Board from './board'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp,
  Lightbulb,
} from 'lucide-react'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen w-full max-w-screen-2xl flex-col items-center justify-center gap-16 bg-background">
      <Alert className="w-fit">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Dica</AlertTitle>
        <AlertDescription className="flex">
          Para mover um veículo, clique nele e use as setas (
          <span className="flex items-center text-primary">
            <ArrowBigDown /> <ArrowBigLeft /> <ArrowBigRight /> <ArrowBigUp />
          </span>
          ) do teclado para direcioná-lo.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <h1 className="mb-8 text-4xl font-bold">Hora do Rush</h1>
        <Board size={6} />
      </div>
    </div>
  )
}

export default Home
