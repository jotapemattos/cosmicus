'use client'

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
import { getUserPerks } from '../actions/perks-inventories'
import { Skeleton } from '@/components/ui/skeleton'

interface InventoryProps {
  user: User
}

const PerksInventorySkeleton = () => {
  return (
    <section className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="w-72">
          <CardHeader className="space-y-4">
            {/* Title skeleton */}
            <Skeleton className="h-6 w-3/4" />

            {/* Description skeleton */}
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
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

const PerksInventory = ({ user }: InventoryProps) => {
  const { data: perks, isLoading } = useQuery({
    queryKey: ['user-perks', user.id],
    queryFn: () => getUserPerks(),
  })

  if (perks === undefined) {
    return
  }

  if (isLoading) {
    return <PerksInventorySkeleton />
  }

  return (
    <section className="mx-auto w-full max-w-screen-2xl gap-8 space-y-10">
      <h1 className="text-4xl font-extrabold">Habilidades Especiais</h1>
      <div className="grid w-full max-w-screen-2xl grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {perks?.map((perk) => (
          <Card
            key={perk.id}
            className="flex w-full flex-col justify-between md:w-72"
          >
            <CardHeader className="space-y-4">
              <CardTitle>
                <h1>{perk.perks?.name}</h1>
              </CardTitle>
              <CardDescription>{perk.perks?.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex w-full flex-col items-center justify-center gap-4">
              <Image
                src={perk.perks?.picture ?? ''}
                alt="imagem da skin"
                width={500}
                height={500}
                className="aspect-square w-full object-cover"
              />
            </CardContent>
            <CardFooter>
              <p>
                Quantidade: <strong>{perk.quantity}</strong>
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default PerksInventory
