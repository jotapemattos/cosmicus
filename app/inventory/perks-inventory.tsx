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

interface InventoryProps {
  user: User
}

const PerksInventory = ({ user }: InventoryProps) => {
  const { data: perks } = useQuery({
    queryKey: ['user-perks', user.id],
    queryFn: () => getUserPerks(),
  })

  if (perks === undefined) {
    return
  }

  return (
    <section className="mx-auto  w-full max-w-screen-2xl gap-8 space-y-10">
      <h1 className="text-4xl font-extrabold">Habilidades Especiais</h1>
      {perks?.map((perk) => (
        <Card key={perk.id} className="w-72">
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
    </section>
  )
}

export default PerksInventory
