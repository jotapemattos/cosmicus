import React, { useState, useEffect } from 'react'
import { Vehicle as VehicleType } from './vehicle-type'
import Vehicle from './vehicle'
import { Button } from '@/components/ui/button'

interface BoardProps {
  size: number
}

const Board: React.FC<BoardProps> = ({ size }) => {
  const initialVehicles: VehicleType[] = [
    // Target vehicle (red car)
    { id: 1, x: 1, y: 2, length: 2, isHorizontal: true, isTarget: true },

    // Vertical vehicles
    { id: 2, x: 0, y: 0, length: 3, isHorizontal: false },
    // { id: 3, x: 3, y: 0, length: 3, isHorizontal: false },
    { id: 4, x: 5, y: 1, length: 3, isHorizontal: false },
    { id: 5, x: 2, y: 3, length: 3, isHorizontal: false },
    // { id: 6, x: 4, y: 3, length: 2, isHorizontal: false },

    // Horizontal vehicles
    { id: 7, x: 3, y: 3, length: 2, isHorizontal: true },
    { id: 8, x: 0, y: 4, length: 2, isHorizontal: true },
    { id: 9, x: 4, y: 5, length: 2, isHorizontal: true },
  ]

  const [vehicles, setVehicles] = useState<VehicleType[]>(initialVehicles)
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null)
  const [gameWon, setGameWon] = useState(false)

  const resetGame = () => {
    setVehicles(initialVehicles)
  }

  useEffect(() => {
    checkWinCondition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles])

  const checkWinCondition = () => {
    const targetVehicle = vehicles.find((v) => v.isTarget)
    if (targetVehicle && targetVehicle.x + targetVehicle.length === size) {
      setGameWon(true)
    }
  }

  const isValidMove = (vehicle: VehicleType, newX: number, newY: number) => {
    // Check if the new position is within the board boundaries
    if (
      newX < 0 ||
      newY < 0 ||
      newX + (vehicle.isHorizontal ? vehicle.length - 1 : 0) >= size ||
      newY + (vehicle.isHorizontal ? 0 : vehicle.length - 1) >= size
    ) {
      return false
    }

    // Create a set of occupied cells for faster lookup
    const occupiedCells = new Set(
      vehicles.flatMap((v) =>
        Array.from(
          { length: v.length },
          (_, i) =>
            `${v.isHorizontal ? v.x + i : v.x},${v.isHorizontal ? v.y : v.y + i}`,
        ),
      ),
    )

    // Remove the current vehicle's occupied cells
    for (let i = 0; i < vehicle.length; i++) {
      occupiedCells.delete(
        `${vehicle.isHorizontal ? vehicle.x + i : vehicle.x},${vehicle.isHorizontal ? vehicle.y : vehicle.y + i}`,
      )
    }

    // Check if any cell in the new position is occupied
    for (let i = 0; i < vehicle.length; i++) {
      const checkX = vehicle.isHorizontal ? newX + i : newX
      const checkY = vehicle.isHorizontal ? newY : newY + i
      if (occupiedCells.has(`${checkX},${checkY}`)) {
        return false
      }
    }

    return true
  }

  const moveVehicle = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (selectedVehicle === null) return

    const vehicle = vehicles.find((v) => v.id === selectedVehicle)
    if (!vehicle) return

    let newX = vehicle.x
    let newY = vehicle.y

    if (vehicle.isHorizontal) {
      if (direction === 'left') newX--
      if (direction === 'right') newX++
    } else {
      if (direction === 'up') newY--
      if (direction === 'down') newY++
    }

    if (isValidMove(vehicle, newX, newY)) {
      setVehicles(
        vehicles.map((v) =>
          v.id === selectedVehicle ? { ...v, x: newX, y: newY } : v,
        ),
      )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedVehicle === null) return

    switch (e.key) {
      case 'ArrowUp':
        moveVehicle('up')
        break
      case 'ArrowDown':
        moveVehicle('down')
        break
      case 'ArrowLeft':
        moveVehicle('left')
        break
      case 'ArrowRight':
        moveVehicle('right')
        break
    }
  }

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
    </>
  )
}

export default Board
