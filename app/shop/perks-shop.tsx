'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { getPerks } from '../actions/perks'
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
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Image from 'next/image'

import { Coins, Loader2 } from 'lucide-react'
import { getProfileByUserId } from '../actions/profile'
import { User } from '@supabase/supabase-js'

import { addPerksInventoryItem } from '../actions/perks-inventories'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PerksShopProps {
  user: User
}

const PerksShop = ({ user }: PerksShopProps) => {
  const router = useRouter()

  const { data: perks } = useQuery({
    queryKey: ['perks'],
    queryFn: () => getPerks(),
  })

  const { data: profile } = useQuery({
    queryKey: ['profile', user.id],
    queryFn: () => getProfileByUserId({ profileId: user.id }),
  })

  const queryClient = useQueryClient()
  const { mutateAsync: addPerksInventoryItemFn, isPending } = useMutation({
    mutationFn: addPerksInventoryItem,
    onSuccess: () => {
      toast('Habilidade adquirida com sucesso!', {
        action: {
          label: 'Ver inventário',
          onClick: () => router.push('/inventory'),
        },
      })
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
      queryClient.invalidateQueries({ queryKey: ['user-perks', user.id] })
    },
  })

  const handleBuy = async (perkId: number) => {
    await addPerksInventoryItemFn({ perkId })
  }

  if (perks === undefined || !profile) {
    return <p>nao foi</p>
  }

  return (
    <section className="mx-auto my-32 w-full max-w-screen-2xl space-y-10">
      <h1 className="text-4xl font-extrabold">Habilidades especiais</h1>
      <div className="flex w-full flex-wrap gap-10">
        {perks.map((perk) => (
          <Card
            key={perk.id}
            className={cn('w-72', {
              'opacity-50': perk.price! > profile.coins_amount,
            })}
          >
            <CardHeader>
              <CardTitle>{perk.name}</CardTitle>
              <CardDescription>{perk.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex w-full flex-col items-center justify-center gap-4">
              <Image
                src={perk.picture ?? ''}
                alt="imagem da perk"
                width={500}
                height={500}
                className="aspect-square w-full object-cover"
              />
              <span className="flex items-center gap-2 self-start">
                <Coin />
                <p className="sr-only">Preço</p>
                {perk.price}
              </span>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full"
                    disabled={perk.price! > profile.coins_amount}
                  >
                    Comprar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Compra</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogDescription>
                    Você tem certeza que deseja comprar este item? Isso deixará
                    você com{' '}
                    <strong>{profile.coins_amount - perk.price!}</strong>{' '}
                    moedas.
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        disabled={isPending}
                        onClick={() => handleBuy(perk.id)}
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Comprar'
                        )}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default PerksShop
