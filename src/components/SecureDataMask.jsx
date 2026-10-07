import { useEffect, useRef, useState } from 'react'

const REVEAL_TIMEOUT_MS = 10000

// PART 2 — Secure Data Mask (UI privacy control, NOT cryptographic protection).
// Masked by default; "Tap to Reveal" shows the value; auto re-mask after
// exactly 10s; manual hide; timers cleaned up on hide/unmount; the revealed
// value lives only in local state and is never logged or persisted.
export default function SecureDataMask({ value, label = 'Sensitive identifier' }) {
  const [revealed, setRevealed] = useState(false)
  const [announcement, setAnnouncement] = useState('Value hidden')
  const timerRef = useRef(null)

  const last4 = typeof value === 'string' && value.length >= 4 ? value.slice(-4) : '****'
  const masked = `XXXX-XXXX-${last4}`

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const hide = () => {
    clearTimer()
    setRevealed(false)
    setAnnouncement('Sensitive value hidden')
  }

  const reveal = () => {
    clearTimer()
    setRevealed(true)
    setAnnouncement('Sensitive value revealed')
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setRevealed(false)
      setAnnouncement('Sensitive value hidden automatically after 10 seconds')
    }, REVEAL_TIMEOUT_MS)
  }

  // Cleanup on unmount so no timer survives and no hidden value lingers.
  useEffect(() => clearTimer, [])

  return (
    <div className="secure-mask">
      <span className="secure-mask__label">{label}</span>
      <code className="secure-mask__value">
        {revealed ? value : masked}
      </code>
      <button
        type="button"
        className="secure-mask__button"
        onClick={revealed ? hide : reveal}
        aria-pressed={revealed}
      >
        {revealed ? 'Tap to Hide' : 'Tap to Reveal'}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </div>
  )
}
