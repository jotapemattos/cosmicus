'use client'

import ProblemCompletedDialog from '@/app/problems/[problemId]/components/problem-completed-dialog'
import { Vehicle as VehicleType } from '../types/vehicle-type'
import Vehicle from './vehicle'
import { Button } from '@/components/ui/button'
import { useRushHour } from '@/hooks/use-rush-hour'

interface BoardProps {
  size: number
  initialVehicles: VehicleType[]
  ctProblemId: number
  userId: string
}

const Board: React.FC<BoardProps> = ({
  size,
  initialVehicles,
  ctProblemId,
  userId,
}) => {
  const {
    vehicles,
    handleKeyDown,
    resetGame,
    gameWon,
    setSelectedVehicle,
    selectedVehicle,
  } = useRushHour({ size, initialVehicles, ctProblemId })

  return (
    <>
      <div className="relative" tabIndex={0} onKeyDown={handleKeyDown}>
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: size * size }).map((_, index) => (
            <div
              key={index}
              className="h-12 w-12 border border-gray-400 bg-gray-200"
            />
          ))}
        </div>
        <div className="absolute left-0 top-0 h-full w-full">
          {vehicles.map((vehicle) => (
            <Vehicle
              isSelected={selectedVehicle === vehicle.id}
              key={vehicle.id}
              vehicle={vehicle}
              onClick={() => setSelectedVehicle(vehicle.id)}
              size={size} // Pass the size prop here
            />
          ))}
        </div>
        {gameWon && (
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
            <div className="rounded bg-white p-4">
              <h2 className="text-2xl font-bold">Muito bem!</h2>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Button onClick={() => resetGame()}>Reiniciar</Button>
      </div>

      {gameWon && (
        <ProblemCompletedDialog problemId={ctProblemId} userId={userId} />
      )}
    </>
  )
}

export default Board
