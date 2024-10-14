import Image from 'next/image'
import React from 'react'

// Create a proper interface that extends from ImageProps
interface RocketProps
  extends Omit<
    React.ComponentProps<typeof Image>,
    'src' | 'alt' | 'width' | 'height'
  > {
  // You can add additional props here if needed
}

const Rocket: React.FC<RocketProps> = (props) => {
  return (
    <Image
      {...props}
      src="/rocket.png"
      alt="Imagem de estrela"
      width={64}
      height={64}
    />
  )
}

export default Rocket
