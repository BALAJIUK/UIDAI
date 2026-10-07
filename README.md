# VC Wallet – UIDAI Sandbox Frontend Assignment

A production-quality React PWA demonstrating a secure Verifiable Credential Wallet using mock data only. No real Aadhaar, no PII, no real UIDAI APIs.

## Features
- Credential Dashboard (responsive grid, loading / error / empty / success states)
- Redux Toolkit state (idle, loading, succeeded, failed)
- `SecureDataMask` component: masked by default, reveal on tap, auto re-mask after exactly 10 s, manual hide, full timer & state cleanup
- Offline-capable PWA: installable manifest + service worker, network-first caching of `GET /api/credentials`
- Accessible: semantic HTML, focusable controls, visible focus, `aria-live` announcements
- Vitest + React Testing Library suite (fake timers, 10-second timeout verified)

## Tech stack
React 19, JavaScript, Vite 8, Redux Toolkit, React-Redux, Vitest, React Testing Library, vanilla Service Worker.

## Architecture
```
src/
├── app/store.js                     Redux store
├── components/
│   ├── CredentialCard.jsx           memoized card, SecureDataMask inside
│   ├── CredentialList.jsx           responsive grid list
│   ├── SecureDataMask.jsx           secure identifier masking
│   ├── LoadingState.jsx / ErrorState.jsx / EmptyState.jsx
├── features/credentials/
│   ├── credentialsSlice.js          async thunk + status reducers
│   └── credentialsAPI.js            fetch GET /api/credentials
├── hooks/useOnlineStatus.js         online/offline detection
├── pages/Dashboard.jsx              header, profile, count, list, states
├── services/mockApi.js              fictional credentials (dev middleware source)
├── styles/globals.css
├── tests/SecureDataMask.test.jsx
├── main.jsx                         SW registration here
└── App.jsx
public/
├── manifest.webmanifest
├── icons/icon.svg
└── service-worker.js                network-first for /api/credentials
```

In dev/preview, a small Vite middleware serves `GET /api/credentials` from `src/services/mockApi.js`. In production, the service worker intercepts the same GET request.

## Getting started
```bash
npm install
npm run dev        # start dev server
npm test           # run automated tests
npm run build      # production build
npm run preview    # preview the production build (SW active)
npm run lint       # oxlint
```

## PWA / offline strategy
- `manifest.webmanifest` + SVG icon make the app installable.
- `service-worker.js` handles only `GET /api/credentials`:
  1. network-first,
  2. cache the latest successful response,
  3. on network failure serve the cached list,
  4. if nothing cached, return `[]` fallback.
- Non-GET requests are never cached by the worker.
- UI shows an offline banner when `navigator.onLine` is false.

**Security considerations for caching identity data:** Cache Storage is unencrypted per-origin storage on the user's device. Cached credential lists can be read by anyone with device access, so production deployments should avoid persisting full identifiers, prefer short cache TTLs, clear caches on logout, and rely on TLS + device-level encryption (e.g. OS disk encryption). This demo caches mock data only.

## SecureDataMask security design
- Identifier is masked by default (`XXXX-XXXX-9012`).
- Revealing is explicit (button), re-hides automatically after exactly 10 000 ms, and manual hide is instant.
- Timer refs are cleared on hide, unmount, and before re-reveal; no timeout leaks.
- The unmasked value lives only in local component state and is overwritten on hide. It is never logged, never placed in URLs, `localStorage`, or aria attributes.
- `XXXX-XXXX-9012` style masking means the first digits are never rendered.
- **Important limitation:** masking is a UI privacy control, not cryptographic protection. Anyone with DevTools access can inspect props/state. Real protection requires encryption, server-side tokenization, and OS-level secure enclaves.

## Accessibility
- Semantic elements (`header`, `main`, `article`, `dl`, `button`).
- Reveal button is focusable, has `aria-pressed`, visible focus ring (WCAG contrast).
- `role="status"` / `aria-live="polite"` announce revealed/hidden transitions.
- Color badges pair background with sufficiently dark text; skeletons are `aria-hidden` with a text alternative.
- Keyboard: all actions reachable via Tab/Enter/Space.

## Testing strategy
Vitest + React Testing Library + fake timers. The suite verifies: masked by default, value hidden initially, reveal on click, screen-reader announcement change, masking after exactly 10 000 ms (checking 9 999 ms still revealed, then 1 ms more), reveal-state reset, timer cleanup (`vi.getTimerCount()`), manual hide, no-throw unmount, and no console logging of the sensitive value.

## Assumptions
- Mock API only; no real UIDAI/Aadhaar integration.
- All identifiers are fictional.
- "Logout" is a refresh/profile affordance; no auth is implemented.

## Limitations
- Masking is not encryption; Redux state holds mock identifiers for demo purposes (in production, fetch sensitive values on demand and keep them out of global state).
- Service worker caches responses without encryption or TTL.
- No route-based code splitting beyond a single dashboard page.
- No real authentication/authorization.

## Future improvements
- On-demand identifier reveal API (no persistent storage of sensitive values).
- TTL-based cache invalidation and logout cache purge.
- AES/WebCrypto-encrypted cached payloads, biometric gate for reveal.
- E2E tests (Playwright) for offline PWA flows.

## GitHub
Repository URL placeholder: `https://github.com/<your-username>/vc-wallet-uidai-sandbox`
