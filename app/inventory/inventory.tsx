'use client'

import { getInventoriesAndSkinsByUserId } from '@/data/inventories'
import { useQuery } from '@tanstack/react-query'
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

interface InventoryProps {
  user: User
}

const Inventory = ({ user }: InventoryProps) => {
  const { data: inventories } = useQuery({
    queryKey: ['user-inventory', user.id],
    queryFn: () => getInventoriesAndSkinsByUserId({ profileId: user.id }),
  })

  if (inventories === undefined) {
    return
  }

  return (
    <section className="mx-auto flex w-full max-w-screen-2xl gap-8">
      {inventories?.map((inventory) => (
        <Card key={inventory.id} className="w-72">
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
          <CardFooter></CardFooter>
        </Card>
      ))}
    </section>
  )
}

export default Inventory
