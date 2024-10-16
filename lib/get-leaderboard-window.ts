import { Profile } from '@/db/custom-types'

interface GetLeaderboardWindowProps {
  profiles: Profile[]
  targetProfile: Profile
}

export default function getLeaderboardWindow({
  profiles,
  targetProfile,
}: GetLeaderboardWindowProps): Profile[] {
  // Sort profiles by experience points in descending order

  // Find index of target profile
  const targetIndex = profiles.findIndex(
    (profile) => profile.id === targetProfile.id,
  )

  // Handle first place
  if (targetIndex === 0) {
    return profiles.slice(0, 3)
  }

  // Handle last place
  if (targetIndex === profiles.length - 1) {
    return profiles.slice(-3)
  }

  // Handle second place
  if (targetIndex === 1) {
    return profiles.slice(0, 3)
  }

  // Handle second-to-last place
  if (targetIndex === profiles.length - 2) {
    return profiles.slice(-3)
  }

  // Normal case: return target profile with one above and one below
  return profiles.slice(targetIndex - 1, targetIndex + 2)
}
