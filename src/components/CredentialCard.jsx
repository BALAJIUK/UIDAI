// PART 1 — Credential card; embeds PART 2 SecureDataMask for the identifier.
import { memo } from 'react'
import SecureDataMask from './SecureDataMask'

function CredentialCard({ credential }) {
  const statusClass = credential.status === 'Active' ? 'badge--active' : 'badge--inactive'
  return (
    <article className="card" aria-labelledby={`card-title-${credential.id}`}>
      <header className="card__header">
        <h2 id={`card-title-${credential.id}`}>{credential.name}</h2>
        <span className="card__badges">
          <span className={`badge ${statusClass}`}>{credential.status}</span>
        </span>
      </header>
      <dl className="card__details">
        <div><dt>Issuer</dt><dd>{credential.issuer}</dd></div>
        <div><dt>Type</dt><dd>{credential.type}</dd></div>
        <div><dt>Issued</dt><dd>{credential.issuedAt}</dd></div>
      </dl>
      <SecureDataMask value={credential.identifier} />
    </article>
  )
}

export default memo(CredentialCard)
