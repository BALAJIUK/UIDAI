// PART 1 — Responsive credential grid.
import { memo } from 'react'
import CredentialCard from './CredentialCard'

function CredentialList({ credentials }) {
  return (
    <section aria-label="Credential list" className="grid">
      {credentials.map((c) => (
        <CredentialCard key={c.id} credential={c} />
      ))}
    </section>
  )
}

export default memo(CredentialList)
