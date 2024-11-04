import { useCallback, useRef } from 'react'

interface SoundEffects {
  playSuccess: () => void
  playError: () => void
  playClick: () => void
  playCelebration: () => void
  playPurchase: () => void
}

export function useSoundEffects(): SoundEffects {
  const audioContextRef = useRef<AudioContext | null>(null)

  const createAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    return audioContextRef.current
  }, [])

  const playTone = useCallback(
    (
      frequency: number,
      duration: number,
      type: OscillatorType = 'sine',
      startTime = 0,
      gainValue = 0.2,
      gainAttack = 0.01,
      gainRelease = 0.1,
    ) => {
      const audioContext = createAudioContext()
      const currentTime = audioContext.currentTime
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      // Ensure all timing values are positive
      const safeStartTime = Math.max(0, currentTime + startTime)
      const safeDuration = Math.max(0.01, duration)
      const safeAttack = Math.max(0.01, gainAttack)
      const safeRelease = Math.max(0.01, gainRelease)

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, safeStartTime)

      // Ensure all timing values are properly sequenced
      gainNode.gain.setValueAtTime(0.001, safeStartTime)
      gainNode.gain.exponentialRampToValueAtTime(
        gainValue,
        safeStartTime + safeAttack,
      )
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        safeStartTime + safeDuration,
      )

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.start(safeStartTime)
      oscillator.stop(safeStartTime + safeDuration)

      return safeStartTime + safeDuration // Return the end time for scheduling
    },
    [createAudioContext],
  )

  const playSuccess = useCallback(() => {
    playTone(800, 0.1, 'sine')
    setTimeout(() => playTone(1200, 0.15, 'sine'), 100)
  }, [playTone])

  const playError = useCallback(() => {
    playTone(300, 0.15, 'sawtooth')
    setTimeout(() => playTone(250, 0.15, 'sawtooth'), 150)
  }, [playTone])

  const playClick = useCallback(() => {
    playTone(600, 0.05, 'sine')
  }, [playTone])

  const playCelebration = useCallback(() => {
    const audioContext = createAudioContext()
    const startTime = audioContext.currentTime
    const baseDuration = 2.5

    // Fanfare theme - Main melody (brass-like)
    const fanfare = [
      { freq: 523.25, time: 0, duration: 0.3 }, // C5
      { freq: 659.25, time: 0.3, duration: 0.3 }, // E5
      { freq: 783.99, time: 0.6, duration: 0.6 }, // G5
      { freq: 1046.5, time: 1.2, duration: 0.8 }, // C6
    ]

    // Play fanfare with "brass" sound
    fanfare.forEach((note) => {
      // Main brass sound
      playTone(note.freq, note.duration, 'sawtooth', note.time, 0.15, 0.05, 0.1)
      // Layered square wave for richness
      playTone(note.freq, note.duration, 'square', note.time, 0.08, 0.05, 0.1)
    })

    // Orchestral sustain (strings-like pad)
    const chordNotes = [
      523.25, // C5
      659.25, // E5
      783.99, // G5
      1046.5, // C6
    ]

    // Layer string-like pads
    chordNotes.forEach((freq) => {
      playTone(freq, baseDuration, 'sine', 0.8, 0.08, 0.4, 0.8)
    })

    // Timpani-like bass hits
    playTone(130.81, 0.5, 'sine', 0, 0.3, 0.01, 0.3) // C3
    playTone(130.81, 0.5, 'sine', 1.2, 0.3, 0.01, 0.3) // C3

    // Cymbal-like crescendo
    for (let i = 0; i < 8; i++) {
      const crescendoTime = 1.5 + i * 0.1
      playTone(
        5000 + Math.random() * 2000,
        0.3,
        'sine',
        crescendoTime,
        0.01 + i * 0.01,
      )
    }

    // Sparkling arpeggios
    for (let i = 0; i < 12; i++) {
      const sparkleTime = 1.8 + i * 0.05
      playTone(
        2000 + Math.random() * 1000,
        0.2,
        'sine',
        sparkleTime,
        0.03,
        0.01,
        0.1,
      )
    }

    // Triumphant final chord
    const finalChordDelay = baseDuration * 0.8
    setTimeout(() => {
      const finalChordNotes = [
        { freq: 523.25, type: 'sawtooth' }, // C5
        { freq: 659.25, type: 'sawtooth' }, // E5
        { freq: 783.99, type: 'sawtooth' }, // G5
        { freq: 1046.5, type: 'sawtooth' }, // C6
        { freq: 523.25, type: 'sine' }, // C5 (sine layer)
        { freq: 659.25, type: 'sine' }, // E5 (sine layer)
        { freq: 783.99, type: 'sine' }, // G5 (sine layer)
      ]

      finalChordNotes.forEach(({ freq, type }) => {
        playTone(freq, 0.8, type as OscillatorType, 0, 0.1, 0.05, 0.4)
      })
    }, finalChordDelay * 1000)
  }, [playTone, createAudioContext])

  const playPurchase = useCallback(() => {
    const audioContext = createAudioContext()
    const currentTime = audioContext.currentTime

    // Enhanced metallic sound function with more parameters
    const playMetallicSound = (
      baseFreq: number,
      startTime: number,
      duration: number = 0.15,
      gainValue: number = 0.3,
    ) => {
      // Main tone with longer sustain
      playTone(baseFreq, duration, 'triangle', startTime, gainValue, 0.01, 0.1)

      // Rich metallic overtones
      const overtones = [1.5, 2, 2.5, 3, 4.16, 5.43, 6.79]
      overtones.forEach((multiplier, i) => {
        playTone(
          baseFreq * multiplier,
          duration * 0.8,
          'sine',
          startTime,
          (gainValue * 0.15) / (i + 1),
          0.01,
          0.08,
        )
      })
    }

    // Initial dramatic swoosh
    for (let i = 0; i < 8; i++) {
      playTone(2000 - i * 200, 0.1, 'sine', i * 0.02, 0.05, 0.01, 0.05)
    }

    // Sequence of epic coin sounds
    playMetallicSound(1200, 0.1, 0.2, 0.4) // Rich base tone
    playMetallicSound(1800, 0.2, 0.15, 0.3) // Higher accent
    playMetallicSound(2400, 0.3, 0.1, 0.2) // Highest accent

    // Magical shimmer effect (more pronounced)
    for (let i = 0; i < 12; i++) {
      const sparkleTime = 0.3 + i * 0.03
      const frequency = 3000 + Math.random() * 2000

      // Main sparkle
      playTone(frequency, 0.15, 'sine', sparkleTime, 0.04, 0.01, 0.1)

      // Sparkle echo
      playTone(
        frequency * 1.5,
        0.1,
        'sine',
        sparkleTime + 0.05,
        0.02,
        0.01,
        0.05,
      )
    }

    // Triumphant chord progression
    setTimeout(() => {
      const chordProgression = [
        // First chord (Em9)
        [
          { freq: 329.63, type: 'triangle' }, // E4
          { freq: 493.88, type: 'triangle' }, // B4
          { freq: 587.33, type: 'triangle' }, // D5
          { freq: 698.46, type: 'triangle' }, // F5
        ],
        // Resolution chord (C6/9)
        [
          { freq: 523.25, type: 'triangle' }, // C5
          { freq: 659.25, type: 'triangle' }, // E5
          { freq: 783.99, type: 'triangle' }, // G5
          { freq: 987.77, type: 'triangle' }, // B5
          { freq: 587.33, type: 'triangle' }, // D5
        ],
      ]

      // Play first chord
      chordProgression[0].forEach(({ freq, type }) => {
        playTone(freq, 0.3, type as OscillatorType, 0, 0.12, 0.05, 0.2)
      })

      // Play resolution chord
      setTimeout(() => {
        chordProgression[1].forEach(({ freq, type }) => {
          playTone(freq, 0.5, type as OscillatorType, 0, 0.15, 0.05, 0.3)
        })

        // Add bass note for extra richness
        playTone(
          130.81, // C3
          0.5,
          'sine',
          0,
          0.2,
          0.05,
          0.3,
        )
      }, 300)
    }, 400)

    // Rising transition effect
    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        const freq = 1000 + i * 200
        playTone(freq, 0.1, 'sine', i * 0.02, 0.04, 0.01, 0.05)
      }
    }, 700)

    // Final sparkle flourish
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        const sparkleTime = i * 0.04
        playTone(
          4000 + Math.random() * 2000,
          0.15,
          'sine',
          sparkleTime,
          0.05,
          0.01,
          0.1,
        )
      }
    }, 900)
  }, [playTone, createAudioContext])

  return { playSuccess, playError, playClick, playCelebration, playPurchase }
}
