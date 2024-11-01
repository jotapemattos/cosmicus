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
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import Image from 'next/image'

import { Loader2 } from 'lucide-react'
import { getProfileByUserId } from '../actions/profile'
import { User } from '@supabase/supabase-js'

import { addPerksInventoryItem } from '../actions/perks-inventories'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Coin from '@/components/icons/coin'
import Rocket from '@/components/icons/rocket'

interface PerksShopProps {
  user: User
}

const SkeletonPerkItem = () => (
  <div className="flex w-fit flex-col">
    <Card className="w-72">
      <CardContent className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-lg">
        <Skeleton className="size-72" />
      </CardContent>
    </Card>
    <Skeleton className="relative bottom-6 h-10 w-24 self-center" />
    <Skeleton className="h-6 w-32 self-center" />
  </div>
)

const PerksShop = ({ user }: PerksShopProps) => {
  const router = useRouter()

  const { data: perks, isLoading: isLoadingPerks } = useQuery({
    queryKey: ['perks'],
    queryFn: () => getPerks(),
  })

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
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

  const isLoading = isLoadingPerks || isLoadingProfile

  if (isLoading) {
    return (
      <section className="mx-auto my-32 w-full space-y-10 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <Skeleton className="mb-10 h-10 w-64" />
        <div className="lg:grix-cols-3 mx-auto flex grid w-full max-w-screen-2xl grid-cols-1 justify-between gap-12 md:grid-cols-2 2xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <SkeletonPerkItem key={index} />
          ))}
        </div>
      </section>
    )
  }

  if (perks === undefined || !profile) {
    return null
  }

  return (
    <section className="mx-auto my-32 w-full space-y-10 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
      <div className="flex flex-col items-center gap-2 text-center md:flex-row">
        <Rocket />
        <h1 className="text-4xl font-extrabold">Habilidades especiais</h1>
      </div>
      <div className="mx-auto grid w-full grid-cols-1 place-items-start justify-items-center gap-12 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {perks.map((perk) => (
          <div key={perk.id} className="flex w-fit flex-col gap-2">
            <Card
              className={cn('w-72', {
                'opacity-50': perk.price! > profile.coins_amount,
              })}
            >
              <CardContent className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-lg p-6">
                <div className="absolute right-1/2 top-0 h-28 w-28 translate-x-1/2 translate-y-1/2 rounded-3xl bg-primary opacity-50 blur-3xl" />
                <Image
                  src={perk.picture ?? ''}
                  alt="imagem da perk"
                  width={200}
                  height={200}
                  className="z-10 aspect-square w-full object-cover"
                />
              </CardContent>
            </Card>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="relative bottom-6 flex w-fit items-center gap-2 self-center border-primary"
                  disabled={perk.price! > profile.coins_amount}
                  variant={'outline'}
                >
                  <Coin />
                  <p className="sr-only">Preço</p>
                  {perk.price}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Compra</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  Você tem certeza que deseja comprar este item? Isso deixará
                  você com <strong>{profile.coins_amount - perk.price!}</strong>{' '}
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
            <h3 className="text-xl font-semibold">{perk.name}</h3>
            <p className="max-w-72 text-muted-foreground">{perk.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PerksShop
