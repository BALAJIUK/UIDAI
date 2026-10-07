// PART 1 — Error state with Retry.
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <p>Unable to load credentials{message ? `: ${message}` : '.'}</p>
      <button type="button" className="btn" onClick={onRetry}>Retry</button>
    </div>
  )
}
