'use client'
import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import CtProblemCompletedDialog from '@/app/ct-problems/components/ct-problem-completed-dialog'

// Abstract base class representing a space resource
abstract class SpaceResource {
  constructor(
    public id: string,
    public type: string,
    public complexity: number,
  ) {}

  // Abstract method to be implemented by subclasses
  abstract process(): number
}

// Concrete implementations of space resources
class EnergyCell extends SpaceResource {
  constructor(
    id: string,
    public capacity: number,
  ) {
    super(id, 'Energy', 3)
  }

  process(): number {
    return this.capacity * 0.5
  }
}

class WaterReservoir extends SpaceResource {
  constructor(
    id: string,
    public volume: number,
  ) {
    super(id, 'Water', 2)
  }

  process(): number {
    return this.volume * 0.3
  }
}

class OxygenGenerator extends SpaceResource {
  constructor(
    id: string,
    public efficiency: number,
  ) {
    super(id, 'Oxygen', 4)
  }

  process(): number {
    return this.efficiency * 0.7
  }
}

// Space Resource Management Problem Component
const SpaceResourceProblem: React.FC = () => {
  const [resources, setResources] = useState<SpaceResource[]>([])
  const [systemStability, setSystemStability] = useState(0)
  const [problemCompleted, setProblemCompleted] = useState(false)

  const addResource = useCallback(
    (resourceType: string) => {
      let newResource: SpaceResource | null = null

      switch (resourceType) {
        case 'EnergyCell':
          newResource = new EnergyCell(`energy-${resources.length + 1}`, 100)
          break
        case 'WaterReservoir':
          newResource = new WaterReservoir(`water-${resources.length + 1}`, 50)
          break
        case 'OxygenGenerator':
          newResource = new OxygenGenerator(
            `oxygen-${resources.length + 1}`,
            75,
          )
          break
      }

      if (newResource) {
        setResources((prev) => [...prev, newResource!])

        // Calculate system stability
        const totalStability =
          resources.reduce((total, resource) => total + resource.process(), 0) +
          newResource.process()

        const averageComplexity =
          resources.reduce(
            (total, resource) => total + resource.complexity,
            0,
          ) /
          (resources.length + 1)

        const stabilityScore = Math.min(totalStability / 10, 100)
        setSystemStability(stabilityScore)

        // Check if problem is completed
        if (resources.length >= 4 && stabilityScore > 70) {
          setProblemCompleted(true)
        }
      }
    },
    [resources],
  )

  const resetProblem = () => {
    setResources([])
    setSystemStability(0)
    setProblemCompleted(false)
  }

  return (
    <div className="container mx-auto bg-gradient-to-b from-indigo-900 to-black p-4 text-white">
      <h2 className="mb-4 text-center text-3xl font-bold">
        🚀 Space Station Resource Management 🛰️
      </h2>

      <div className="mb-4 text-center">
        <p className="mb-2">System Stability: {systemStability.toFixed(2)}%</p>
        <p className="mb-2">Total Resources: {resources.length}</p>
      </div>

      <div className="mb-4 flex justify-center space-x-4">
        <Button
          variant="secondary"
          onClick={() => addResource('EnergyCell')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Energy Cell
        </Button>
        <Button
          variant="secondary"
          onClick={() => addResource('WaterReservoir')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Water Reservoir
        </Button>
        <Button
          variant="secondary"
          onClick={() => addResource('OxygenGenerator')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Oxygen Generator
        </Button>
      </div>

      <div className="mt-4 text-center">
        <h3 className="mb-2 text-xl font-semibold">Current Resources:</h3>
        <div className="grid grid-cols-3 gap-4">
          {resources.map((resource, index) => (
            <div key={resource.id} className="rounded-lg bg-gray-800 p-3">
              <p>
                {resource.type} Resource #{index + 1}
              </p>
              <p>Complexity: {resource.complexity}</p>
              <p>Output: {resource.process().toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button onClick={resetProblem} variant="destructive">
          Reset Mission
        </Button>
      </div>

      {problemCompleted && (
        <CtProblemCompletedDialog category="space-resource-management" />
      )}
    </div>
  )
}

export default SpaceResourceProblem
