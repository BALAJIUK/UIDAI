// PART 1 — Loading skeleton state.
export default function LoadingState() {
  return (
    <div className="state" role="status" aria-live="polite">
      <div className="skeleton-grid" aria-hidden="true">
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
      <p>Loading credentials…</p>
    </div>
  )
}
