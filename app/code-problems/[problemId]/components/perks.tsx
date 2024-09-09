'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { UsePerks } from '@/hooks/use-perks'
import { useParams } from 'next/navigation'

interface PerksProps {
  userId: string
}

const Perks = ({ userId }: PerksProps) => {
  const [openDialogId, setOpenDialogId] = useState<number | null>(null)

  const params = useParams<{ problemId: string }>()
  const problemId = Number(params.problemId)
  const { perksInventory, applyPerk, isLoading, usedPerks } = UsePerks({
    userId,
    problemId,
  })

  // if (!perksInventory || perksInventory.length === 0) return null

  const openDialog = (perkId: number) => {
    if (!usedPerks[perkId]) {
      setOpenDialogId(perkId)
    }
  }

  const closeDialog = () => {
    setOpenDialogId(null)
  }

  const handleApplyPerk = async (perkId: number) => {
    await applyPerk(perkId)
    closeDialog()
  }

  const isPerkUsable = ({
    perkId,
    quantity,
  }: {
    perkId: number
    quantity: number
  }) => {
    return usedPerks[perkId] || quantity === 0
  }

  return (
    <>
      {perksInventory?.map((perk) => (
        <AlertDialog
          key={perk.id}
          open={openDialogId === perk.id}
          onOpenChange={(isOpen) =>
            isOpen ? openDialog(perk.id) : closeDialog()
          }
        >
          <AlertDialogTrigger
            onClick={() => openDialog(perk.id)}
            disabled={isPerkUsable({
              perkId: perk.id,
              quantity: perk.quantity,
            })}
          >
            <Image
              src={perk.perks?.picture as string}
              alt={`Image of ${perk.perks?.name}`}
              width={32}
              height={32}
            />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Ao utilizar o item <strong>{perk.perks?.name}</strong>, você
                terá <strong>{perk.quantity - 1}</strong> restantes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDialog}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleApplyPerk(perk.perks?.id as number)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Confirmar'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </>
  )
}

export default Perks
