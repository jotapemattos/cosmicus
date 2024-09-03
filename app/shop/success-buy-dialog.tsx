'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { activateInventoryItem } from '@/app/actions/inventories'
import { getSkinById } from '@/app/actions/skins'
import { Inventory } from '@/db/custom-types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

interface SuccessBuyDialogProps {
  inventory: Inventory
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const SuccessBuyDialog = ({
  inventory,
  open,
  setOpen,
}: SuccessBuyDialogProps) => {
  const { data: skin } = useQuery({
    queryKey: ['skin', inventory.skin_id],
    queryFn: () => getSkinById({ skinId: inventory.skin_id! }),
  })

  const { mutateAsync: activateInventoryItemFn, isPending } = useMutation({
    mutationFn: activateInventoryItem,
    onSuccess: () => {
      toast.success('Item equipado com sucesso!')
    },
    onError: () => {
      toast.error('Não foi possível equipar o item.')
    },
  })

  if (skin === undefined) {
    return
  }

  const handleActivate = async () => {
    await activateInventoryItemFn({
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
          <Button className="w-[150px]" variant={'secondary'} asChild>
            <Link href={'/inventory'}>Ver Inventário</Link>
          </Button>
          <Button
            className="w-[150px]"
            disabled={isPending}
            onClick={handleActivate}
          >
            {isPending ? (
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
