import Board from './components/board'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp,
  Lightbulb,
} from 'lucide-react'
import getVehiclesPosition from './utils/get-vehicles-position'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

interface RushHourPageProps {
  params: {
    id: number
  }
}

const RushHourPage = async ({ params: { id } }: RushHourPageProps) => {
  const initialVehicles = getVehiclesPosition({ problemId: id })

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  if (!initialVehicles) return notFound()

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
        <Board size={6} initialVehicles={initialVehicles} ctProblemId={id} />
      </div>
    </div>
  )
}

export default RushHourPage
