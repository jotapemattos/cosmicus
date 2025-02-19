'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  activateInventoryItem,
  removeInventoryItem,
} from '@/app/actions/inventories'
import { getSkinById } from '@/app/actions/skins'
import { Inventory } from '@/db/custom-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { toast } from 'sonner'
import { useSoundEffects } from '@/hooks/use-sound-effects'

interface SuccessBuyDialogProps {
  inventory: Inventory
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  userId: string
}

const SuccessBuyDialog = ({
  inventory,
  open,
  setOpen,
  userId,
}: SuccessBuyDialogProps) => {
  const { playPurchase } = useSoundEffects()

  const { data: skin } = useQuery({
    queryKey: ['skin', inventory.skin_id],
    queryFn: () => getSkinById({ skinId: inventory.skin_id! }),
  })

  const queryClient = useQueryClient()

  const { mutateAsync: activateInventoryItemFn, isPending: isActivatePending } =
    useMutation({
      mutationFn: activateInventoryItem,
      onSuccess: () => {
        toast.success('Item equipado com sucesso!')
      },
      onError: () => {
        toast.error('Não foi possível equipar o item.')
      },
    })

  const { mutateAsync: removeInventoryItemFn, isPending: isRemovePending } =
    useMutation({
      mutationFn: removeInventoryItem,
      onSuccess: () => {
        toast.success('Item removido com sucesso!')
        queryClient.invalidateQueries({ queryKey: ['inventory', userId] })
        queryClient.invalidateQueries({ queryKey: ['profile', userId] })
      },
      onError: () => {
        toast.error('Não foi possível remover o item.')
      },
    })

  useEffect(() => {
    playPurchase()

    // eslint-disable-next-line
  }, [])

  if (skin === undefined) {
    return
  }

  const handleActivate = async () => {
    await activateInventoryItemFn({
      inventoryId: inventory.id,
    })

    setOpen(false)
  }

  const handleRemove = async () => {
    await removeInventoryItemFn({
      inventoryId: inventory.id,
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Parabéns!</DialogTitle>
          <DialogDescription>
            Você adquiriu o item{' '}
            <strong className="text-primary">{skin?.name}</strong>. Deseja
            equipá-lo agora?
          </DialogDescription>
        </DialogHeader>
        <div className="mx-auto w-2/3">
          <Image
            src={skin.picture ?? ''}
            width={500}
            height={500}
            alt={`Imagem do item ${skin?.name}`}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="mx-auto flex items-center gap-4">
          <Button
            className="w-[150px]"
            disabled={isActivatePending}
            onClick={handleRemove}
            variant={'destructive'}
          >
            {isRemovePending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Desfazer'
            )}
          </Button>
          <Button
            className="w-[150px]"
            disabled={isActivatePending}
            onClick={handleActivate}
          >
            {isActivatePending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Equipar'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessBuyDialog
