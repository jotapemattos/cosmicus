import { cn } from '@/lib/utils'

interface LevelBadgeProps {
  userLevel: number
  className?: string
}

export default function LevelBadge({ userLevel, className }: LevelBadgeProps) {
  return (
    <div
      className={cn(
        'flex size-2 items-center justify-center rounded-full border-2 p-3 text-sm font-medium',
        {
          'border-indigo-300 bg-indigo-300/50': userLevel <= 10,
          'border-indigo-400 bg-indigo-400/50':
            userLevel > 10 && userLevel <= 20,
          'border-indigo-500 bg-indigo-500/50':
            userLevel > 20 && userLevel <= 30,
          'border-indigo-600 bg-indigo-600/50':
            userLevel > 30 && userLevel <= 40,
          'border-indigo-700 bg-indigo-700/50':
            userLevel > 40 && userLevel <= 50,
          'border-indigo-800 bg-indigo-800/50':
            userLevel > 50 && userLevel <= 60,
          'border-indigo-900 bg-indigo-900/50':
            userLevel > 60 && userLevel <= 70,
          'border-indigo-950 bg-indigo-950/50': userLevel > 70,
        },
        className,
      )}
    >
      {userLevel}
    </div>
  )
}
