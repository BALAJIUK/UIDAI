// PART 1 — Dashboard shell (list, loading/error/empty states, profile,
// count, demo scenario buttons).
// PART 2 — SecureDataMask is embedded inside each CredentialCard.
// PART 3 — Online/offline status chip + banner, served via service worker.
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadCredentials, selectCredentials, selectError, selectStatus } from '../features/credentials/credentialsSlice'
import CredentialList from '../components/CredentialList'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import useOnlineStatus from '../hooks/useOnlineStatus'

export default function Dashboard() {
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  const status = useSelector(selectStatus)
  const error = useSelector(selectError)
  const online = useOnlineStatus()

  useEffect(() => {
    if (status === 'idle') dispatch(loadCredentials())
  }, [dispatch, status])

  const retry = () => dispatch(loadCredentials())

  return (
    <main className="page">
      <header className="header header--part1">
        <div>
          <h1>Verifiable Credential Wallet</h1>
          <p className="header__subtitle">UIDAI Sandbox · Mock data only</p>
        </div>
        <div className="profile" aria-label="User profile">
          <span className={`net-chip ${online ? 'net-chip--online' : 'net-chip--offline'}`} role="status">
            <span className="net-dot" aria-hidden="true" />
            {online ? 'Online' : 'Offline'}
          </span>
          <span className="avatar" aria-hidden="true">DS</span>
          <span>Demo User</span>
          <button type="button" className="btn btn--ghost" onClick={retry}>Refresh</button>
        </div>
      </header>

      {!online ? (
        <p className="offline-banner" role="status">
          You are offline — the app is showing saved (cached) credentials from your last online session.
        </p>
      ) : (
        <p className="online-banner" role="status">
          You are online — credentials load from the server, and the latest copy is saved on this device for offline use.
        </p>
      )}

      <div className="demo-controls" role="group" aria-label="Demo scenarios">
        <button type="button" className="btn btn--ghost" onClick={() => dispatch(loadCredentials())}>Success</button>
        <button type="button" className="btn btn--ghost" onClick={() => dispatch(loadCredentials('empty'))}>Empty</button>
        <button type="button" className="btn btn--ghost" onClick={() => dispatch(loadCredentials('error'))}>Error</button>
      </div>

      {status === 'succeeded' && (
        <p className="count count--part1" aria-live="polite">{credentials.length} credential{credentials.length === 1 ? '' : 's'}</p>
      )}

      {status === 'loading' && <LoadingState />}
      {status === 'failed' && <ErrorState message={error} onRetry={retry} />}
      {status === 'succeeded' && credentials.length === 0 && <EmptyState />}
      {status === 'succeeded' && credentials.length > 0 && <CredentialList credentials={credentials} />}
    </main>
  )
}
