import Image from 'next/image'
import React from 'react'

const FistPlace = () => {
  return (
    <Image
      src={'/first-place.png'}
      alt="Imagem de primeiro lugar"
      width={32}
      height={32}
    />
  )
}

export default FistPlace
