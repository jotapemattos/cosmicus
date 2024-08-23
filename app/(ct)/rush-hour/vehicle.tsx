import React from 'react'
import { Vehicle as VehicleType } from './vehicle-type'

interface VehicleProps {
  isSelected: boolean
  vehicle: VehicleType
  onClick: () => void
  size: number // Add this prop to receive the board size
}

const vehiclesColors: Record<number, string> = {
  2: 'bg-emerald-500',
  3: 'bg-sky-500',
  4: 'bg-purple-500',
  5: 'bg-zinc-500',
  6: 'bg-sky-800',
  7: 'bg-purple-800',
  8: 'bg-orange-200',
  9: 'bg-orange-500',
}
const Vehicle: React.FC<VehicleProps> = ({
  vehicle,
  onClick,
  size,
  isSelected,
}) => {
  const cellSize = 100 / size // Calculate the size of each cell as a percentage

  const style = {
    width: vehicle.isHorizontal
      ? `${cellSize * vehicle.length}% `
      : `${cellSize}%`,
    height: vehicle.isHorizontal
      ? `${cellSize}%`
      : `${cellSize * vehicle.length}%`,
    position: 'absolute' as const,
    top: `${vehicle.y * cellSize}%`,
    left: `${vehicle.x * cellSize}%`,
    transition: 'top 0.3s, left 0.3s', // Add smooth transition for movement
  }

  return (
    <div
      className={`flex cursor-pointer items-center justify-center ${
        vehicle.isTarget ? 'bg-red-500' : vehiclesColors[vehicle.id]
      } 
      ${isSelected && 'ring-4 ring-black'}
      rounded font-bold text-white`}
      style={style}
      onClick={onClick}
    >
      {vehicle.id}
    </div>
  )
}

export default Vehicle
