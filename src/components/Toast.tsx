import { useEffect } from 'react'
import { AlertIcon } from './icons'
import styles from './Toast.module.css'

type Props = {
  message: string
  onDone: () => void
  duration?: number
}

export function Toast({ message, onDone, duration = 2500 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, duration)
    return () => clearTimeout(timer)
  }, [onDone, duration])

  return (
    <div role="status" aria-live="polite" className={styles.toast} style={{ animationDuration: `${duration}ms` }}>
      <AlertIcon />
      <strong>{message}</strong>
    </div>
  )
}
