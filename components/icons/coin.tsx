import Image from 'next/image'
import React from 'react'

const Coin = () => {
  return (
    <Image src={'/coin.png'} alt="Imagem de moeda" width={32} height={32} />
  )
}

export default Coin
