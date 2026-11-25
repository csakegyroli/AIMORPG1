# Security model — v2.0 alpha

## Implemented in this milestone

- Passwords are never stored in plain text. The backend hashes them with Node.js scrypt and random salts; comparisons use constant-time equality.
- Sessions use a cryptographically random opaque token in an HttpOnly, SameSite=Lax cookie. Only a SHA-256 digest is stored in PostgreSQL. Sessions expire, can be revoked, and active sessions are capped per account.
- Generic invalid-login messaging and a dummy hash for unknown email addresses reduce account-enumeration and basic timing differences.
- Registration/login routes have endpoint throttles; all API routes have a global in-memory throttle.
- Mutating requests are checked against the configured web origin; production requires an Origin header. CORS uses a single explicit origin and credentials.
- Helmet sets security headers. Request validation strips no unknown fields silently: whitelist validation plus rejection of non-whitelisted fields is enabled.
- Cloud saves are scoped to the authenticated owner, with a ten-save quota, a 900 KB payload limit, label cleaning, and structural checks.
- The AI key is read only by the API process. The AI endpoint requires an authenticated account, has a per-user hourly limit, validates a strict response schema and stores an input digest rather than full input context.
- Audit records do not intentionally store raw IPs or raw failed-login emails. IP identifiers are hashed with `AUDIT_HASH_SECRET`; user-agent strings are truncated.
- Production startup refuses a non-HTTPS `WEB_ORIGIN`, a missing PostgreSQL URL, or a short/default audit hash secret.

## Not production-complete

- In-memory throttling is not distributed and can reset on restart. Use Redis or equivalent shared storage for multi-instance deployments.
- No email verification or secure password reset flow exists yet; account email ownership is therefore not proven.
- No MFA/passkeys, suspicious-login notifications, user-facing session revocation list, bot protection, or admin account-recovery tooling.
- No formal CSRF test suite, penetration test, external audit, managed secrets system, WAF, monitoring/alerting, or tested data-retention policy.
- `express.json` accepts up to 1 MB; individual save payloads are capped at 900 KB. Deploying reverse proxies should enforce a compatible request body limit and timeout.
- Database backups and restore drills are operational tasks and are not automated by this code.
- The local Docker Compose credentials are development defaults and must never be used on a public host.

## Before public launch

1. Use a managed secret store and rotate every example secret.
2. Configure HTTPS, exact frontend origin, secure cookies, HTTPS-only ingress, a private DB network, backups and restore verification.
3. Add email verification, rate-limit backend storage, password reset, MFA/passkeys, account deletion, export and retention workflows.
4. Add dependency/container scanning, logging redaction tests, integration tests for cross-user save access, session revocation, origin/CORS, payload limits, and AI response rejection.
5. Have the deployed system reviewed by a qualified security professional.
