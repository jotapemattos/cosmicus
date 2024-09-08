'use client'

import React, { useEffect, useState } from 'react'
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
import { UseSpecialHint } from '@/hooks/use-special-hint'

interface SpecialHintProps {
  userId: string
}

const SpecialHint = ({ userId }: SpecialHintProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data, applySpecialHint, isLoading, hasUsedSpecialHint } =
    UseSpecialHint({
      userId,
    })

  if (data === undefined || data[0].quantity === 0) return null

  const openDialog = () => {
    if (!hasUsedSpecialHint) {
      setIsOpen(true)
    }
  }

  return (
    <>
      {data.map((perk) => (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen} key={perk.id}>
          <AlertDialogTrigger
            onClick={openDialog}
            disabled={hasUsedSpecialHint}
          >
            <Image
              src={perk.perks?.picture as string}
              alt="Imagem de Cometa"
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
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => applySpecialHint()}
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

export default SpecialHint
