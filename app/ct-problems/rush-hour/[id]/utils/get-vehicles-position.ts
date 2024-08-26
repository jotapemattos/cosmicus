import { Vehicle } from '../types/vehicle-type'

const getVehiclesPosition = ({ problemId }: { problemId: number }) => {
  const vehiclesPosition: Record<number, Vehicle[]> = {
    1: [
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
    ],
  }

  return vehiclesPosition[problemId] ? vehiclesPosition[problemId] : null
}

export default getVehiclesPosition
