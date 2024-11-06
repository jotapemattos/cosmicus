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
    return redirect('/login')
  }

  if (!initialVehicles) return notFound()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-16 bg-background md:max-w-screen-md md:p-0 lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
      <Alert className="w-fit">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Dica</AlertTitle>
        <AlertDescription className="flex flex-col md:flex-row">
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
