import Image from 'next/image'
import React from 'react'

// Create a proper interface that extends from ImageProps
interface FlameProps
  extends Omit<
    React.ComponentProps<typeof Image>,
    'src' | 'alt' | 'width' | 'height'
  > {
  // You can add additional props here if needed
}

const Flame: React.FC<FlameProps> = (props) => {
  return (
    <Image
      {...props}
      src="/flame.png"
      alt="Imagem de estrela"
      width={120}
      height={120}
    />
  )
}

export default Flame
