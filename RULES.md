# SJRPS-Rajajinagar - Architecture & Deployment Rules

These rules must be strictly adhered to across all updates, builds, and deployments:

## 1. Port & Proxy Management
- Port numbers for the server and any reverse proxy must **only and only** be managed via `.env` (`PORT`, `VITE_PORT`, `PROXY_PORT`, `PROXY_TARGET`).
- Never hardcode ports or proxy endpoints in the source code or configurations.

## 2. Zero Vulnerability Modules
- Modules with security vulnerabilities (Moderate, High, Critical) must **never** be used.
- Run `npm audit` to guarantee 0 vulnerabilities before finalizing any changes.

## 3. Allowed Hosts Mapping (`allowedHosts`)
- Never allow host blocking issues such as:
  `Blocked request. This host ("domainname") is not allowed.`
- `allowedHosts` is configured in `vite.config.ts` for both dev (`server`) and production preview (`preview`).
- Mapped dynamically via `ALLOWED_HOSTS` in `.env`.
- Defaults to `true` (allows all domains) unless a specific comma-separated domain whitelist is set in `.env`.

## 4. Server Lifecycle & Verification
- Before any deployment, test and verify the entire execution sequence:
  1. `npm install` (clean dependency install)
  2. `npm run build` (production build)
  3. `npm start` (spins up the live preview server on host and port specified by `.env`)
