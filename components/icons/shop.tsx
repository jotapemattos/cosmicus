import Image from 'next/image'
import React from 'react'

const Shop = () => {
  return (
    <Image
      src={'/shop.png'}
      alt="Imagem de loja"
      width={100}
      height={100}
      className="-ml-5"
    />
  )
}

export default Shop
