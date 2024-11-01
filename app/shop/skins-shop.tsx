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
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  addInventoryItem,
  getInventoriesByUserId,
} from '@/app/actions/inventories'
import { getProfileByUserId } from '@/app/actions/profile'
import { getSkins } from '@/app/actions/skins'
import { Inventory } from '@/db/custom-types'
import { cn } from '@/lib/utils'
import { User } from '@supabase/supabase-js'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import SuccessBuyDialog from './success-buy-dialog'
import Coin from '@/components/icons/coin'

interface SkinsShopProps {
  user: User
}

const SkeletonSkinItem = () => (
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

const SkinsShop = ({ user }: SkinsShopProps) => {
  const [inventoryItem, setInventoryItem] = useState<Inventory | null>()
  const [openBuyDialog, setOpenBuyDialog] = useState<boolean>(false)

  const { data: skins, isLoading: isLoadingSkins } = useQuery({
    queryKey: ['skins'],
    queryFn: () => getSkins(),
  })
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user.id],
    queryFn: () => getProfileByUserId({ profileId: user.id }),
  })

  const { data: inventory, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['inventory', user.id],
    queryFn: () => getInventoriesByUserId(),
  })

  const queryClient = useQueryClient()
  const {
    mutateAsync: addInventoryItemFn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: addInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
      queryClient.invalidateQueries({ queryKey: ['inventory', user.id] })
    },
  })

  const isLoading = isLoadingSkins || isLoadingProfile || isLoadingInventory

  if (isLoading) {
    return (
      <>
        <div className="mx-auto md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <section className="mx-auto flex grid w-full grid-cols-1 justify-between gap-12 sm:grid-cols-2 md:max-w-screen-md lg:max-w-screen-lg lg:grid-cols-3 xl:max-w-screen-xl 2xl:max-w-screen-2xl 2xl:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <SkeletonSkinItem key={index} />
          ))}
        </section>
      </>
    )
  }

  if (skins === undefined || !profile || inventory === undefined) {
    return null
  }

  const handleBuy = async (skinId: number) => {
    const data = await addInventoryItemFn({ skinId })

    if (!isError) {
      setInventoryItem(data)
      setOpenBuyDialog(true)
    }
  }

  const hasSkin = (skinId: number) => {
    return inventory.some((item) => item.skin_id === skinId)
  }

  return (
    <>
      <div className="mx-auto md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div className="flex items-center gap-2">
          <span className="sr-only">Seu dinheiro:</span>
          <Coin />
          <p>{profile.coins_amount}</p>
        </div>
      </div>
      <section className="mx-auto grid w-full grid-cols-1 place-items-center gap-12 sm:grid-cols-2 md:max-w-screen-md md:place-items-start lg:max-w-screen-lg lg:grid-cols-3 xl:max-w-screen-xl 2xl:max-w-screen-2xl 2xl:grid-cols-4">
        {skins.map((skin) => (
          <div key={skin.id} className="flex w-fit flex-col">
            <Card
              className={cn('w-72', {
                'opacity-50': skin.price! > profile.coins_amount,
              })}
            >
              <CardContent className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-lg">
                <div className="absolute right-1/2 top-0 h-28 w-28 translate-x-1/2 translate-y-1/2 rounded-3xl bg-primary opacity-50 blur-3xl" />
                <Image
                  src={skin.picture ?? ''}
                  alt="imagem da skin"
                  width={350}
                  height={350}
                  className="z-50 aspect-square w-full object-cover"
                />
              </CardContent>
            </Card>
            {hasSkin(skin.id) ? (
              <Button
                disabled
                className="relative bottom-6 w-fit self-center border-primary"
                variant={'outline'}
              >
                Você já possui este item!
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="relative bottom-6 w-fit self-center border-primary"
                    disabled={skin.price! > profile.coins_amount}
                    variant={'outline'}
                  >
                    <span className=" flex items-center gap-2 justify-self-start">
                      <Coin />
                      <p className="sr-only">Preço</p>
                      {skin.price}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Compra</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogDescription>
                    Você tem certeza que deseja comprar este item? Isso deixará
                    você com{' '}
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
            <h3 className="self-center text-xl font-semibold">{skin.name}</h3>
          </div>
        ))}
      </section>
      {inventoryItem && (
        <SuccessBuyDialog
          inventory={inventoryItem}
          open={openBuyDialog}
          setOpen={setOpenBuyDialog}
          userId={user.id}
        />
      )}
    </>
  )
}

export default SkinsShop
