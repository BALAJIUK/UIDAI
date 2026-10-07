# Simple Explanation — VC Wallet Assignment

## What we built
A React website (PWA) that looks like a digital ID card wallet. All data is fake (mock). No real Aadhaar, no real APIs.

## Part 1 — Credential Dashboard
- Shows a list of identity cards in a grid (works on mobile, tablet, desktop).
- Each card shows: name, issuer, type, issue date, status (Active/Expired), and a hidden ID number.
- Data comes from a mock API (`/api/credentials`). Redux Toolkit stores the data.
- Three clear states:
  - **Loading** — skeleton cards shown (mock API has a 900ms delay so you can see it).
  - **Error** — error message + Retry button.
  - **Empty** — "No credentials found".
- Buttons on the page let you switch between Success / Empty / Error to demo each state.

## Part 2 — SecureDataMask
- The ID number on each card is hidden by default: `XXXX-XXXX-9012`.
- Tap "Tap to Reveal" → full number shows, button becomes "Tap to Hide".
- After exactly 10 seconds it hides itself again. You can also tap Hide anytime.
- The timer is cleaned up properly (no memory leaks).
- Never printed in console, never put in URLs or localStorage.
- Important: this is a UI privacy trick, not real encryption.

## Part 3 — Offline + Tests
- A service worker saves the last credential list. If you go offline, the app still shows the saved list. Online, it shows fresh data and re-saves it.
- The app can be installed (manifest.json + icon).
- The UI clearly shows "Online" (green) or "Offline" (orange).
- Automated tests (Vitest) check SecureDataMask, including the exact 10-second timeout. Run with `npm test` (8/8 pass).

## How to run
```
npm install
npm run dev       # open the app
npm test          # run tests
npm run build     # production build
npm run preview   # test offline mode
```
