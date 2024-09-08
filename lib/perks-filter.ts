type Perk = {
  id: number
  perk_id: number
  profile_id: string
  quantity: number
  perks: {
    description: string
    id: number
    name: string
    picture: string
    price: number
  } | null
}

interface PerksFilterProps {
  perks: Perk[]
  idTarget: number
}

export function perksFilter({ perks, idTarget }: PerksFilterProps) {
  return perks.find((perk) => perk.perks?.id === idTarget) as Perk
}
