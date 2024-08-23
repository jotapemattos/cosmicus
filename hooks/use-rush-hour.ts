import { Vehicle as VehicleType } from '@/app/(ct)/rush-hour/[id]/types/vehicle-type'
import { createCtSubmission } from '@/app/actions/ct-fundamentals-submission'
import { useMutation } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface UseRushHourProps {
  initialVehicles: VehicleType[]
  size: number
  ctProblemId: number
}

export function useRushHour({
  initialVehicles,
  size,
  ctProblemId,
}: UseRushHourProps) {
  const [vehicles, setVehicles] = useState<VehicleType[]>(initialVehicles)
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null)
  const [gameWon, setGameWon] = useState(false)
  const [seconds, setSeconds] = useState(0)

  const { mutateAsync: createCtSubmissionFn } = useMutation({
    mutationFn: createCtSubmission,
    onSuccess: () => {
      toast.success('God gau')

      //   setOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const resetGame = () => {
    setVehicles(initialVehicles)
  }

  useEffect(() => {
    checkWinCondition()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles])

  useEffect(() => {
    let interval: number | undefined
    if (selectedVehicle) {
      interval = window.setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1)
      }, 1000)
    }
    return () => {
      if (interval !== undefined) {
        clearInterval(interval)
      }
    }
  }, [selectedVehicle])

  const checkWinCondition = async () => {
    const targetVehicle = vehicles?.find((v) => v.isTarget)
    if (targetVehicle && targetVehicle.x + targetVehicle.length === size) {
      setGameWon(true)
      await createCtSubmissionFn({ ctProblemId, timeInSeconds: seconds })
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
      vehicles?.flatMap((v) =>
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

    const vehicle = vehicles?.find((v) => v.id === selectedVehicle)
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
        vehicles!.map((v) =>
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

  return {
    vehicles,
    selectedVehicle,
    handleKeyDown,
    resetGame,
    gameWon,
    setSelectedVehicle,
  }
}
