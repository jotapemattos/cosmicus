import {
  decreaseUserSpecialHints,
  getUserPerks,
} from '@/app/actions/perks-inventories'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface UseSpecialHintProps {
  userId: string
}

export function UseSpecialHint({ userId }: UseSpecialHintProps) {
  const params = useParams<{ problemId: string }>()
  const problemId = Number(params.problemId)
  const [hasUsedSpecialHint, setHasUsedSpecialHint] = useState(false)

  useEffect(() => {
    // Load the state from localStorage when the component mounts
    const storedHasUsedSpecialHint = localStorage.getItem(
      `specialHint_${problemId}_${userId}`,
    )
    if (storedHasUsedSpecialHint !== null) {
      setHasUsedSpecialHint(JSON.parse(storedHasUsedSpecialHint))
    }
  }, [problemId, userId])

  const updateHasUsedSpecialHint = (value: boolean) => {
    setHasUsedSpecialHint(value)
    // Save the state to localStorage whenever it changes
    localStorage.setItem(
      `specialHint_${problemId}_${userId}`,
      JSON.stringify(value),
    )
  }

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['user-special-hints', userId],
    queryFn: () => getUserPerks(),
  })

  const { mutateAsync: decreaseUserSpecialHintsFn } = useMutation({
    mutationFn: decreaseUserSpecialHints,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-special-hints', userId],
      })
      setHasUsedSpecialHint(true)
    },
  })

  const applySpecialHint = async () => {
    await decreaseUserSpecialHintsFn()
  }

  return {
    applySpecialHint,
    data,
    isLoading,
    updateHasUsedSpecialHint,
    hasUsedSpecialHint,
  }
}
