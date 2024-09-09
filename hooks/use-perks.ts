import {
  decreaseUserPerksQuantity,
  getUserPerks,
} from '@/app/actions/perks-inventories'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

interface UsePerksProps {
  userId: string
  problemId: number
}

export function UsePerks({ userId, problemId }: UsePerksProps) {
  const [usedPerks, setUsedPerks] = useState<Record<number, boolean>>({})

  const queryClient = useQueryClient()

  const getLocalStorageKey = (perkId: number) =>
    `usedPerks_${problemId}_${userId}_${perkId}`

  useEffect(() => {
    const loadUsedPerksFromLocalStorage = () => {
      const loadedPerks: Record<number, boolean> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(`usedPerks_${problemId}_${userId}_`)) {
          const perkId = Number(key.split('_').pop())
          loadedPerks[perkId] = JSON.parse(localStorage.getItem(key) || 'false')
        }
      }
      setUsedPerks(loadedPerks)
    }

    loadUsedPerksFromLocalStorage()
  }, [problemId, userId])

  const updateUsedPerk = (perkId: number, value: boolean) => {
    setUsedPerks((prev) => {
      const updatedPerks = { ...prev, [perkId]: value }
      localStorage.setItem(getLocalStorageKey(perkId), JSON.stringify(value))
      return updatedPerks
    })
  }

  const { data: perksInventory, isLoading } = useQuery({
    queryKey: ['user-perks', userId],
    queryFn: () => getUserPerks(),
  })

  useEffect(() => {
    if (perksInventory) {
      const initialUsedPerks: Record<number, boolean> = {}
      perksInventory.forEach((perkInventory) => {
        const storedValue = localStorage.getItem(
          getLocalStorageKey(perkInventory.id),
        )
        initialUsedPerks[perkInventory.id] = storedValue
          ? JSON.parse(storedValue)
          : false
      })
      setUsedPerks((prev) => ({ ...prev, ...initialUsedPerks }))
    }
  }, [perksInventory])

  const { mutateAsync: decreaseUserPerksQuantityFn } = useMutation({
    mutationFn: decreaseUserPerksQuantity,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user-perks', userId],
      })
      updateUsedPerk(variables.perkId, true)
    },
  })

  const applyPerk = async (perkId: number) => {
    await decreaseUserPerksQuantityFn({ perkId })
  }

  return {
    applyPerk,
    perksInventory,
    isLoading,
    updateUsedPerk,
    usedPerks,
  }
}
