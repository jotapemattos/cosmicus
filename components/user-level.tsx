'use client'
import { User } from '@supabase/supabase-js'
import { Progress } from './ui/progress'
import { getUserLevel } from '@/lib/get-user-level'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { getProfileByUserId } from '@/data/profile'
import LevelBadge from './level-badge'

interface UserLevelProps {
  user: User
}

export default function UserLevel({ user }: UserLevelProps) {
  const { data: profile } = useQuery({
    queryKey: ['profile', user.id],
    queryFn: () => getProfileByUserId({ userId: user.id }),
  })

  const { level, progressPercentage } = getUserLevel({
    experiencePoints: profile?.experience_points as number,
  })

  return (
    <div className="flex items-center gap-2 text-sm">
      <LevelBadge userLevel={level} />
      <div>
        <Progress
          value={progressPercentage}
          className={cn('w-48', {
            'bg-indigo-300': level <= 10,
            'bg-indigo-400': level > 10 && level <= 20,
            'bg-indigo-500': level > 20 && level <= 30,
            'bg-indigo-600': level > 30 && level <= 40,
            'bg-indigo-700': level > 40 && level <= 50,
            'bg-indigo-800': level > 50 && level <= 60,
            'bg-indigo-900': level > 60 && level <= 70,
            'bg-indigo-950': level > 70 && level <= 80,
          })}
        />
      </div>
      <LevelBadge userLevel={level + 1} />
    </div>
  )
}
