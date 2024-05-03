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
import addInventoryItem from '@/data/inventories'
import { getProfileByUserId } from '@/data/profile'
import { getSkins } from '@/data/skins'
import { User } from '@supabase/supabase-js'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Coins, Loader2 } from 'lucide-react'
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

  const queryClient = useQueryClient()
  const { mutateAsync: addInventoryItemFn, isPending } = useMutation({
    mutationFn: addInventoryItem,
    onSuccess: () => {
      /*       queryClient.setQueryData(['profile', user.id], (data: Profile) => {
        return {
          ...data,
          coins_amount: 0,
        }
      }) */
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
      //      toast.success('Perfil alterado com sucesso')

      //      setOpen(false)
    },
  })

  if (skins === undefined || !profile) {
    return
  }

  const handleBuy = async (skinId: number) => {
    await addInventoryItemFn({ userId: user.id, skinId })
  }

  return (
    <section className="mx-auto flex w-full max-w-screen-2xl justify-between">
      <p>{profile.coins_amount}</p>
      {skins.map((skin) => (
        <Card key={skin.id} className="w-72">
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
            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <Button className="w-full">Comprar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você tem certeza que deseja comprar esse item?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação te deixará com{' '}
                    <strong>{profile.coins_amount - skin.price!}</strong> moedas
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isPending}
                    onClick={() => handleBuy(skin.id)}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Comprar'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}
export default Shop
