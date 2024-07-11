interface GetUserLevelProps {
  experiencePoints: number
}

export const getUserLevel = ({ experiencePoints }: GetUserLevelProps) => {
  let level = 1
  let xpForNextLevel = 100
  const growthFactor = 1.05

  while (experiencePoints >= xpForNextLevel) {
    experiencePoints -= xpForNextLevel
    level++
    xpForNextLevel = Math.floor(xpForNextLevel * growthFactor)
  }

  const progressPercentage = (experiencePoints / xpForNextLevel) * 100

  return {
    level,
    progressPercentage,
  }
}
