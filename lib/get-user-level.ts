interface GetUserLevelProps {
  experiencePoints: number
}

export const getUserLevel = ({ experiencePoints }: GetUserLevelProps) => {
  let level = 1
  let xpForNextLevel = 250 // Increased base XP requirement
  const baseGrowthFactor = 1.15 // Steeper base growth factor

  while (experiencePoints >= xpForNextLevel) {
    experiencePoints -= xpForNextLevel
    level++
    // Exponential growth formula that scales harder with each level
    xpForNextLevel = Math.floor(
      250 * Math.pow(baseGrowthFactor, level - 1) + level * 50,
    )
  }

  const progressPercentage = (experiencePoints / xpForNextLevel) * 100

  return {
    level,
    progressPercentage,
  }
}
