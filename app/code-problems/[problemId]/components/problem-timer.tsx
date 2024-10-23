import { useState, useEffect } from 'react'

interface ProblemTimerProps {
  problemId: number
  userId: string
  hasFrozenTimer: boolean
}

const ProblemTimer: React.FC<ProblemTimerProps> = ({
  problemId,
  userId,
  hasFrozenTimer,
}) => {
  const [seconds, setSeconds] = useState<number>(0)
  const [isFrozen, setIsFrozen] = useState<boolean>(false)
  const [freezeTimeLeft, setFreezeTimeLeft] = useState<number>(0)
  const freezeInitializedKey = `freeze_initialized_${userId}_${problemId}`

  // Create a unique key for localStorage
  const storageKey = `timer_${userId}_${problemId}`
  const freezeStorageKey = `timer_freeze_${userId}_${problemId}`

  // Initialize timer and freeze state from localStorage
  useEffect(() => {
    const storedTime = localStorage.getItem(storageKey)
    const storedFreezeTime = localStorage.getItem(freezeStorageKey)
    const hasInitializedFreeze = localStorage.getItem(freezeInitializedKey)

    if (storedTime) {
      setSeconds(parseInt(storedTime, 10))
    }

    // Check if we have an active freeze
    if (storedFreezeTime) {
      const freezeEndTime = parseInt(storedFreezeTime, 10)
      const currentTime = Date.now()
      if (freezeEndTime > currentTime) {
        setIsFrozen(true)
        setFreezeTimeLeft(Math.ceil((freezeEndTime - currentTime) / 1000))
      } else {
        localStorage.removeItem(freezeStorageKey)
      }
    }
    // If perk is used but freeze hasn't been initialized yet
    else if (hasFrozenTimer && !hasInitializedFreeze) {
      setIsFrozen(true)
      setFreezeTimeLeft(60)
      const freezeEndTime = Date.now() + 60000
      localStorage.setItem(freezeStorageKey, freezeEndTime.toString())
      localStorage.setItem(freezeInitializedKey, 'true')
    }
  }, [storageKey, freezeStorageKey, freezeInitializedKey, hasFrozenTimer])

  // Countdown for freeze timer
  useEffect(() => {
    if (isFrozen && freezeTimeLeft > 0) {
      const freezeInterval = setInterval(() => {
        setFreezeTimeLeft((prev) => {
          if (prev <= 1) {
            setIsFrozen(false)
            localStorage.removeItem(freezeStorageKey)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(freezeInterval)
    }
  }, [isFrozen, freezeTimeLeft, freezeStorageKey])

  // Main timer logic
  useEffect(() => {
    if (isFrozen) return

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds + 1
        localStorage.setItem(storageKey, newSeconds.toString())
        return newSeconds
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isFrozen, storageKey])

  // Format time as HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? `0${v}` : v))
      .join(':')
  }
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg p-4 md:flex-row">
      {isFrozen && (
        <div className="flex font-semibold text-muted-foreground">
          Vazio Temporal: {freezeTimeLeft}s
        </div>
      )}
      <div className="font-mono text-3xl">{formatTime(seconds)}</div>
    </div>
  )
}

export default ProblemTimer
