'use client'

import {
  activateInventoryItem,
  getInventoriesAndSkinsByUserId,
} from '@/app/actions/inventories'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { User } from '@supabase/supabase-js'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Inventory as InventoryType } from '@/db/custom-types'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

interface InventoryProps {
  user: User
}

const InventorySkeleton = () => {
  return (
    <section className="mx-auto grid w-full grid-cols-1 gap-8 md:max-w-screen-md md:grid-cols-2 lg:max-w-screen-lg xl:max-w-screen-xl xl:grid-cols-3 2xl:max-w-screen-2xl 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="w-72">
          <CardHeader className="space-y-4">
            {/* Title skeleton */}
            <Skeleton className="h-6 w-3/4" />

            {/* Badge skeleton */}
            <Skeleton className="h-5 w-24" />
          </CardHeader>

          <CardContent className="flex w-full flex-col items-center justify-center gap-4">
            {/* Image skeleton */}
            <Skeleton className="aspect-square w-full" />
          </CardContent>

          <CardFooter>
            {/* Button skeleton */}
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}

const Inventory = ({ user }: InventoryProps) => {
  const queryClient = useQueryClient()

  const { data: inventories, isLoading } = useQuery({
    queryKey: ['user-inventory', user.id],
    queryFn: () => getInventoriesAndSkinsByUserId(),
  })

  const { mutateAsync: activateInventoryItemFn } = useMutation({
    mutationFn: activateInventoryItem,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['user-inventory', user.id],
        (oldData: InventoryType[] | undefined) => {
          if (!oldData) return oldData
          return oldData.map((item) => ({
            ...item,
            is_activated: item.id === variables.inventoryId,
          }))
        },
      )

      toast.success('Item equipado com sucesso.')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  if (isLoading) {
    return <InventorySkeleton />
  }

  if (inventories === undefined) {
    return
  }

  return (
    <section className="mx-auto grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xl:grid-cols-3 2xl:max-w-screen-2xl 2xl:grid-cols-4">
      {inventories?.map((inventory) => (
        <Card key={inventory.id} className="w-full md:w-72">
          <CardHeader className="space-y-4">
            <CardTitle>
              <h1>{inventory.skins?.name}</h1>
            </CardTitle>
            <Badge
              className={cn('w-fit', {
                'bg-red-500/10 text-red-500 hover:bg-red-500/10':
                  !inventory.is_activated,
                'bg-green-500/10 text-green-500 hover:bg-green-500/10':
                  inventory.is_activated,
              })}
            >
              {inventory.is_activated ? 'Equipado' : 'Não equipado'}
            </Badge>
            <CardDescription>{inventory.skins?.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex w-full flex-col items-center justify-center gap-4">
            <Image
              src={inventory.skins?.picture ?? ''}
              alt="imagem da skin"
              width={500}
              height={500}
              className="aspect-square w-full object-cover"
            />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              disabled={inventory.is_activated as boolean}
              onClick={() =>
                activateInventoryItemFn({ inventoryId: inventory.id })
              }
            >
              {inventory.is_activated ? 'Equipado' : 'Equipar'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}

export default Inventory
