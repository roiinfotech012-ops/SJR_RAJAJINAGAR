# Agent Instructions & Strict Directives for SJRPS-Rajajinagar

These four core directives are mandatory and MUST be strictly followed at all times:

1. **Port & Proxy Management**:
   - Port numbers for the server and any proxy MUST ONLY and ONLY be managed via `.env` (`PORT`, `VITE_PORT`, `PROXY_PORT`, `PROXY_TARGET`).
   - Never hardcode ports or proxy URLs in any code or config file.

2. **Zero Vulnerability Severity Modules**:
   - Never use or introduce packages with vulnerability severities (Moderate, High, Critical).
   - `npm audit` MUST always report `found 0 vulnerabilities`.

3. **Allowed Hosts Configuration (`server.allowedHosts` & `preview.allowedHosts`)**:
   - Host blocking errors (such as `Blocked request. This host ("domainname") is not allowed. To allow this host, add "domainname" to server.allowedHosts in vite.config.js`) MUST NEVER occur.
   - `allowedHosts` in `vite.config.ts` is mapped directly to `.env` (`ALLOWED_HOSTS`).
   - If not explicitly restricted, it defaults to `true` (allowing all domains and reverse proxies).

4. **Testing & Server Deployment Verification**:
   - Before delivering any code or deployment, rigorously test the complete 3-step lifecycle:
     1. `npm install` (clean dependency installation)
     2. `npm run build` (production build)
     3. `npm start` (starts the production server respecting `.env` for port, host, and allowedHosts).
