import {
  decreaseUserSpecialHints,
  getUserPerks,
} from '@/app/actions/perks-inventories'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface UseSpecialHintProps {
  userId: string
  setHasUsedSpecialHint: (value: boolean) => void
}

export function UseSpecialHint({
  userId,
  setHasUsedSpecialHint,
}: UseSpecialHintProps) {
  const queryClient = useQueryClient()

  const { data: specialHints, isLoading } = useQuery({
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
    specialHints,
    isLoading,
  }
}
