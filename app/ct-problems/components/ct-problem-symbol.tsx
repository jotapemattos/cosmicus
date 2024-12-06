import React from 'react'
import Image from 'next/image'

interface CtProblemSymbolProps {
  category: string
}

const CtProblemSymbol: React.FC<CtProblemSymbolProps> = ({ category }) => {
  switch (category) {
    case 'rush-hour': {
      return (
        <Image
          src="/car.png"
          alt="Imagem de Carro"
          width={500}
          height={500}
          className="aspect-square h-40 w-40 rounded-xl border bg-gradient-to-r from-background to-primary/20"
        />
      )
    }
    case 'space-mission-planner': {
      return (
        <Image
          src="/clipboard.png"
          alt="Imagem de uma prancheta"
          width={500}
          height={500}
          className="aspect-square h-40 w-40 rounded-xl border bg-gradient-to-r from-background to-primary/20"
        />
      )
    }
    case 'space-resource-management': {
      return (
        <Image
          src="/numbers-soup.png"
          alt="Imagem de uma sopa de numeros"
          width={500}
          height={500}
          className="aspect-square h-40 w-40 rounded-xl border bg-gradient-to-r from-background to-primary/20"
        />
      )
    }
  }
}

export default CtProblemSymbol
