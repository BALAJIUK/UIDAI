// PART 1 — GET /api/credentials client.
// In dev/preview a Vite middleware answers; in production the service worker
// serves network-first with offline cache fallback (see public/service-worker.js).
const API_URL = '/api/credentials'

export async function fetchCredentials(signal, scenario) {
  const url = scenario ? `${API_URL}?scenario=${scenario}` : API_URL
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  const data = await response.json()
  if (!Array.isArray(data)) {
    throw new Error('Malformed credentials payload')
  }
  return data
}
