// PART 3 — Automated tests (Vitest + React Testing Library, fake timers).
import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SecureDataMask from '../components/SecureDataMask'

const VALUE = '123456789012'
const MASKED = 'XXXX-XXXX-9012'

describe('SecureDataMask', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('renders masked data by default', () => {
    render(<SecureDataMask value={VALUE} />)
    expect(screen.getByText(MASKED)).toBeInTheDocument()
  })

  it('does not show the full sensitive value initially', () => {
    render(<SecureDataMask value={VALUE} />)
    expect(screen.queryByText(VALUE)).not.toBeInTheDocument()
  })

  it('reveals the full value when "Tap to Reveal" is clicked', async () => {
    render(<SecureDataMask value={VALUE} />)
    fireEvent.click(screen.getByRole('button', { name: /tap to reveal/i }))
    expect(screen.getByText(VALUE)).toBeInTheDocument()
  })

  it('announces to screen readers when data is revealed', async () => {
    render(<SecureDataMask value={VALUE} />)
    fireEvent.click(screen.getByRole('button', { name: /tap to reveal/i }))
    expect(screen.getByRole('status')).toHaveTextContent('Sensitive value revealed')
  })

  it('masks again and resets state after exactly 10 seconds', async () => {
    render(<SecureDataMask value={VALUE} />)
    fireEvent.click(screen.getByRole('button', { name: /tap to reveal/i }))
    expect(screen.getByText(VALUE)).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(9999)
    })
    expect(screen.getByText(VALUE)).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.getByText(MASKED)).toBeInTheDocument()
    expect(screen.queryByText(VALUE)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tap to reveal/i })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('hidden')
  })

  it('cleans up the timer when the component unmounts', async () => {
    const { unmount } = render(<SecureDataMask value={VALUE} />)
    fireEvent.click(screen.getByRole('button', { name: /tap to reveal/i }))
    unmount()
    expect(() => vi.advanceTimersByTime(10000)).not.toThrow()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('manual hide masks immediately and clears the timer', async () => {
    render(<SecureDataMask value={VALUE} />)
    fireEvent.click(screen.getByRole('button', { name: /tap to reveal/i }))
    fireEvent.click(screen.getByRole('button', { name: /tap to hide/i }))
    expect(screen.getByText(MASKED)).toBeInTheDocument()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not log sensitive data to the console', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    render(<SecureDataMask value={VALUE} />)
    fireEvent.click(screen.getByRole('button', { name: /tap to reveal/i }))
    act(() => vi.advanceTimersByTime(10000))
    for (const call of logSpy.mock.calls) {
      expect(call.join(' ')).not.toContain(VALUE)
    }
  })
})
