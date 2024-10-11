import FistPlace from '@/components/icons/first-place'
import SecondPlace from '@/components/icons/second-place'
import ThirdPlace from '@/components/icons/third-place'
import React from 'react'

interface UserPositionProps {
  value: number
}

const UserPosition: React.FC<UserPositionProps> = ({ value }) => {
  switch (value) {
    case 1:
      return <FistPlace />
      break
    case 2:
      return <SecondPlace />
      break
    case 3:
      return <ThirdPlace />
      break
    default:
      return `#${value}`
  }
}

export default UserPosition
