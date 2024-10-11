import Image from 'next/image'
import React from 'react'

const SecondPlace = () => {
  return (
    <Image
      src={'/second-place.png'}
      alt="Imagem de segundo lugar"
      width={32}
      height={32}
    />
  )
}

export default SecondPlace
