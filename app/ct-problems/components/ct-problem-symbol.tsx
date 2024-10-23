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
          width={120}
          height={120}
          className="aspect-square h-40 w-40 rounded-xl border bg-gradient-to-r from-background to-primary/20"
        />
      )
    }
  }
}

export default CtProblemSymbol
