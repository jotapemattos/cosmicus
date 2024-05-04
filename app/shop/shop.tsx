'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import addInventoryItem, { getInventoriesByUserId } from '@/data/inventories'
import { getProfileByUserId } from '@/data/profile'
import { getSkins } from '@/data/skins'
import { cn } from '@/lib/utils'
import { User } from '@supabase/supabase-js'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleDollarSign, Coins, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ShopProps {
  user: User
}

const Shop = ({ user }: ShopProps) => {
  const { data: skins } = useQuery({
    queryKey: ['skins'],
    queryFn: () => getSkins(),
  })
  const { data: profile } = useQuery({
    queryKey: ['profile', user.id],
    queryFn: () =>
      getProfileByUserId({
        userId: user.id,
      }),
  })

  const { data: inventory } = useQuery({
    queryKey: ['inventory', user.id],
    queryFn: () =>
      getInventoriesByUserId({
        profileId: user.id,
      }),
  })

  const queryClient = useQueryClient()
  const { mutateAsync: addInventoryItemFn, isPending } = useMutation({
    mutationFn: addInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
      queryClient.invalidateQueries({ queryKey: ['inventory', user.id] })
    },
  })

  if (skins === undefined || !profile || inventory === undefined) {
    return
  }

  const handleBuy = async (skinId: number) => {
    await addInventoryItemFn({ userId: user.id, skinId })
  }

  const hasSkin = (skinId: number) => {
    return inventory.some((item) => item.skin_id === skinId)
  }

  return (
    <>
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex items-center gap-2">
          <span className="sr-only">Seu dinheiro:</span>
          <CircleDollarSign />
          <p>{profile.coins_amount}</p>
        </div>
      </div>
      <section className="mx-auto flex w-full max-w-screen-2xl justify-between">
        {skins.map((skin) => (
          <Card
            key={skin.id}
            className={cn('w-72', {
              'opacity-50': skin.price! > profile.coins_amount,
            })}
          >
            <CardHeader>
              <CardTitle>{skin.name}</CardTitle>
              <CardDescription>{skin.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex w-full flex-col items-center justify-center gap-4">
              <Image
                src={skin.picture ?? ''}
                alt="imagem da skin"
                width={500}
                height={500}
                className="aspect-square w-full object-cover"
              />
              <span className="flex items-center gap-2 self-start">
                <Coins />
                <p className="sr-only">Preço</p>
                {skin.price}
              </span>
            </CardContent>
            <CardFooter>
              {hasSkin(skin.id) ? (
                <Button disabled className="w-full">
                  Você já possui este item!
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      disabled={skin.price! > profile.coins_amount}
                    >
                      Comprar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Compra</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      Você tem certeza que deseja comprar este item? Isso
                      deixará você com{' '}
                      <strong>{profile.coins_amount - skin.price!}</strong>{' '}
                      moedas.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          disabled={isPending}
                          onClick={() => handleBuy(skin.id)}
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
              )}
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  )
}
export default Shop
