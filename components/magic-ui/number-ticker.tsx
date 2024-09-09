'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

import { cn } from '@/lib/utils'

export default function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  className,
  defaultValue,
}: {
  defaultValue: number
  value: number
  direction?: 'up' | 'down'
  className?: string
  delay?: number // delay in s
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(
    direction === 'down' ? defaultValue + value : defaultValue,
  )
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  useEffect(() => {
    isInView &&
      setTimeout(() => {
        motionValue.set(
          direction === 'down' ? defaultValue : defaultValue + value,
        )
      }, delay * 1000)
  }, [motionValue, isInView, delay, value, direction, defaultValue])

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat('en-US').format(
            latest.toFixed(0),
          )
        }
      }),
    [springValue],
  )

  return (
    <span
      className={cn(
        'inline-block tabular-nums tracking-wider text-foreground',
        className,
      )}
      ref={ref}
    />
  )
}
