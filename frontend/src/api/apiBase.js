/**
 * Single source of truth for the API base URL.
 *
 * Defaults to localhost:5000 (the team's setup). Developers whose
 * machine has a conflict on port 5000 — e.g. macOS AirPlay Receiver —
 * can override without touching committed code by creating
 * `frontend/.env.local` with:
 *
 *   VITE_API_BASE_URL=http://localhost:5001/api
 *
 * `.env.local` is gitignored, so this ends the recurring 5000/5001
 * merge conflicts.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
