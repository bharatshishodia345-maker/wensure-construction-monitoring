# WENSURE Incremental Implementation Roadmap & Delivery Strategy

**Document Version:** 1.0.0  
**Status:** Phased Implementation Master Plan  
**Author:** Staff-Level Systems Architect & Full-Stack Lead  
**Target Repository:** `WENSURE FINAL 1`  
**Date:** March 2026  

---

## 1. Roadmap Principles & Migration Guardrails

The transformation of WENSURE from a client-only prototype into an enterprise-grade full-stack platform is governed by five non-negotiable principles:

1. **Zero Regressions:** Every phase must preserve existing route accessibility, visual layouts, and demo interactions. At no point should the application enter a non-runnable state.
2. **Dual-Mode Continuity:** The frontend will feature an automated API adapter. When the Node.js backend is active, data flows through PostgreSQL; when offline or during quick local reviews, it gracefully falls back to the in-browser sandbox state.
3. **Single Source of Truth:** Database schemas and TypeScript contracts mirror the established domain entities in [`src/types/index.ts`](file:///c:/Users/Bharat%20Thakur/OneDrive/Desktop/AI/WENSURE%20FINAL%201/src/types/index.ts) and [`src/data/demoData.ts`](file:///c:/Users/Bharat%20Thakur/OneDrive/Desktop/AI/WENSURE%20FINAL%201/src/data/demoData.ts).
4. **Security by Default:** All verification status changes, financial disbursements, and inspection publications require server-enforced role authorizations.
5. **Measured Milestones:** Each phase specifies concrete acceptance criteria and verification commands.

---

## 2. Phase-by-Phase Implementation Plan

```
                                  IMPLEMENTATION TIMELINE
                                  
  Phase 0      Phase 1      Phase 2      Phase 3      Phase 4      Phase 5      Phase 6      Phase 7      Phase 8
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Baseline │ │ Backend  │ │ Auth &   │ │ Domain   │ │ Frontend │ │ Trust    │ │ UI/UX    │ │ 3D Engine│ │ E2E Test │
│ Stabilize│ │ & DB     │ │ RBAC     │ │ Services │ │ API Layer│ │ & Evidence│ │ Editorial│ │ & Audio  │ │ & Polish │
│ & Tooling│ │ (Prisma) │ │ Security │ │ & Seeds  │ │ Dual-Mode│ │ Pipeline │ │ Overhaul │ │ Memory   │ │ Release  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

---

### Phase 0: Baseline Stabilization & Tooling Preparation
**Objective:** Restore clean build states and resolve pre-existing linter warnings without changing any application behavior.

* **Tasks:**
  1. Fix the root `index.html` file by restoring the standard Vite entrypoint (`<script type="module" src="/src/main.tsx"></script>`) from `index (2).html`, eliminating the missing bundle error.
  2. Clean up the 7 minor unused variable and import warnings reported by `oxlint` across admin and customer pages.
  3. Verify that `npm run build` generates a pristine production bundle in `dist/` and `npm run dev` serves the application without console errors.
* **Verification Criteria:**
  * `npm run build` exits with code 0.
  * `npx oxlint` passes with zero warnings.

---

### Phase 1: Backend Foundation & Relational Database
**Objective:** Establish the Node.js Express service, Docker Compose environment, and Prisma ORM schema.

* **Tasks:**
  1. Create `server/` directory structure:
     ```
     server/
     ├── src/
     │   ├── config/          # Environment variables, database connection
     │   ├── middleware/      # Error handler, logging, rate limiter
     │   ├── routes/          # Express route definitions
     │   ├── controllers/     # Request handlers
     │   ├── services/        # Business logic & trust engine
     │   └── app.ts           # Express application setup
     ├── prisma/
     │   ├── schema.prisma    # Complete PostgreSQL schema
     │   └── seed.ts          # Canonical Baner Villa seed script
     ├── package.json
     └── tsconfig.json
     ```
  2. Implement `docker-compose.yml` for local PostgreSQL 16, MinIO, and Redis.
  3. Initialize Prisma schema with the models designed in [`docs/SYSTEM_DESIGN.md`](file:///c:/Users/Bharat%20Thakur/OneDrive/Desktop/AI/WENSURE%20FINAL%201/docs/SYSTEM_DESIGN.md) (`User`, `Project`, `Milestone`, `InspectionReport`, `ObservationIssue`, `BudgetTransaction`, `AuditLog`).
  4. Write `prisma/seed.ts` to populate the canonical "Baner Modern Villa" dataset matching `INITIAL_PROJECT`.
* **Verification Criteria:**
  * `docker compose up -d` starts PostgreSQL on port 5432.
  * `npx prisma migrate dev` creates all tables successfully.
  * `npx prisma db seed` inserts the complete demo dataset without schema violations.

---

### Phase 2: Authentication, RBAC & Route Security
**Objective:** Replace client-only simulated logins with secure, signed JWT tokens and server-enforced role authorization.

* **Tasks:**
  1. Implement password hashing using `argon2` and secure JWT access/refresh token generation.
  2. Create Express auth middleware:
     * `authenticate`: Validates bearer token or session cookie.
     * `requireRole(allowedRoles)`: Enforces role permissions on protected routes.
  3. Create dedicated `/api/v1/auth/demo-login` endpoint allowing 1-click test credentials for Homeowner, Contractor, and Admin.
  4. Implement React Router 7 route guards in frontend (`src/components/auth/ProtectedRoute.tsx`):
     * Redirect unauthenticated users to `/login`.
     * Redirect unauthorized roles to their respective dashboards.
* **Verification Criteria:**
  * Unauthenticated requests to `/api/v1/projects` return `401 Unauthorized`.
  * Non-admin requests to `/api/v1/admin/*` return `403 Forbidden`.
  * Direct browser navigation to `/admin/dashboard` by a homeowner safely redirects with a clean warning toast.

---

### Phase 3: Core Domain Services & Data Persistence
**Objective:** Implement REST controllers and transactional services for projects, milestones, inspections, observations, and financials.

* **Tasks:**
  1. **Projects Service:** Query project overview, progress metrics, and associated stakeholders.
  2. **Milestones Service:** Fetch project milestones, track completion status, and record contractor progress updates.
  3. **Inspections Service:** Publish formal independent audit reports with scorecards and checklist evaluations.
  4. **Observations Service:** Create defect tickets, submit contractor rectification responses, and record auditor signoffs.
  5. **Financials Service:** Track budget allocations, escrow holds, and disbursement transaction ledgers.
* **Verification Criteria:**
  * All REST endpoints tested via automated integration tests.
  * Milestone status transitions obey the state machine rules defined in the trust model.

---

### Phase 4: Frontend API Integration & State Modernization
**Objective:** Connect React views to backend REST endpoints via TanStack Query, while preserving offline sandbox fallback.

* **Tasks:**
  1. Install `@tanstack/react-query` and `axios` in frontend.
  2. Build modular API client services (`src/services/api/`):
     * `authApi.ts`, `projectsApi.ts`, `milestonesApi.ts`, `inspectionsApi.ts`, `budgetApi.ts`.
  3. Create Dual-Mode Context: If backend server is unreachable, `AppContext` automatically operates in offline demo mode using `localStorage`.
  4. Refactor mutation actions (`submitWorkUpdate`, `submitObservationResponse`, `resolveObservation`) to trigger API mutations with automatic React Query cache invalidation.
* **Verification Criteria:**
  * When backend is running, state mutations persist directly to PostgreSQL.
  * When backend is stopped, frontend displays an ambient *"Offline Sandbox Mode"* badge and continues operating seamlessly.

---

### Phase 5: Verification Engine & Evidence Pipeline (Task 4)
**Objective:** Implement cryptographic evidence hashing, EXIF GPS geofence validation, and tamper-evident audit logging.

* **Tasks:**
  1. Implement S3 presigned URL generation for secure, direct browser uploads to MinIO/S3.
  2. Build server-side photo metadata extraction:
     * Extract EXIF capture timestamp and GPS latitude/longitude.
     * Validate coordinates against registered project boundary.
     * Compute and record SHA-256 byte digest.
  3. Implement immutable `AuditLog` service recording every state transition (`MILESTONE_VERIFIED`, `PAYMENT_RELEASED`, `DEFECT_RESOLVED`).
  4. Build public cryptographic verification badge component in frontend displaying image hash and GPS confirmation.
* **Verification Criteria:**
  * Photos uploaded with GPS coordinates outside the project site boundary are flagged as `UNVERIFIED_LOCATION`.
  * Any attempt to verify a milestone without an attached inspection report is rejected by the server.

---

### Phase 6: UI/UX Redesign & Premium Editorial Experience (Task 5)
**Objective:** Upgrade all workspace views across Customer, Contractor, and Admin to match the luxury editorial architectural standard.

* **Tasks:**
  1. **Customer Portal:** High-density project health HUD, interactive Gantt milestone tracker, printable inspection report certificates with QR codes, escrow disbursement release modal.
  2. **Contractor Portal:** Streamlined field work submission studio, defect rectification uploader, verified audit scorecard badge.
  3. **Admin Portal:** Portfolio risk monitor, digital field auditor report builder, escrow dispute mediation center.
  4. **Navigation & Layout:** Enhanced desktop sidebar with active route badges, mobile responsive slide-over drawer, project selector switcher in top bar.
* **Verification Criteria:**
  * Responsive across mobile (375px), tablet (768px), desktop (1280px), and ultrawide (1920px).
  * Print styles on `/customer/inspections` produce professional single-page audit reports.

---

### Phase 7: 3D Engine & Web Audio Performance Overhaul (Task 6)
**Objective:** Eliminate GPU memory leaks, implement dirty-flag rendering, and overhaul Web Audio lifecycle.

* **Tasks:**
  1. Implement recursive scene-graph traversal in `SceneManager.destroy()` to dispose all geometries, materials, textures, and render targets.
  2. Implement scroll-throttled dirty-flag rendering in `SceneManager.animate()`, reducing idle GPU consumption by up to 75%.
  3. Add device capability tiering (Tier 1/2/3) adjusting shadow map resolution and geometry complexity based on device performance.
  4. Overhaul `soundEngine.ts`:
     * Add `teardown()` method clearing intervals and closing audio nodes.
     * Add tab visibility listeners (`visibilitychange`) to pause audio when browser tab is hidden.
     * Add smooth exponential gain ramping to prevent pops and clicks.
* **Verification Criteria:**
  * Navigating 10 times between `/` and `/overview` shows stable GPU memory in Chrome DevTools Performance monitor (zero memory accumulation).
  * Web Audio intervals are completely cleared upon navigating away from `/`.

---

### Phase 8: End-to-End Testing, Security Hardening & Polish
**Objective:** Final validation, performance profiling, and production release readiness.

* **Tasks:**
  1. Run automated end-to-end user journeys (Homeowner inspects milestone, Contractor submits update, Auditor signs off, Payment releases).
  2. Perform security hardening: Helmet HTTP headers, CORS whitelisting, rate limiting on auth endpoints, input sanitization via Zod schemas.
  3. Run Lighthouse performance audits on public landing and customer dashboard pages (Target: >90 Performance, 100 Accessibility, 100 Best Practices, 100 SEO).
* **Verification Criteria:**
  * All integration and E2E tests pass.
  * Zero security vulnerabilities reported by `npm audit`.

---

## 3. Risk Assessment & Mitigation Strategies

| Risk | Impact | Probability | Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **Breaking Existing Demo Workflows** | High | Low | Strangler Fig migration pattern. All existing demo fixtures retained as persistent fallback. |
| **GPU Crash on Low-End Mobile** | High | Medium | Implement Tier 3 device detection clamping pixel ratio to 1.5, disabling point lights, and reducing geometry LOD. |
| **LocalStorage Quota Exceeded** | Medium | Medium | Migrate heavy base64 strings to S3 presigned URLs. LocalStorage retained strictly for lightweight session tokens and cached preferences. |
| **Web Audio Browser Autoplay Block** | Low | High | Web Audio initialization is already gated behind an explicit user click on the unmute button (`soundEngine.toggleMute()`). |
| **Schema Migration Drift** | Medium | Low | Versioned Prisma migrations committed to repository with automated seed verification on build. |

---

## 4. Definition of Done & Success Criteria

The upgrade is considered fully accomplished when:
1. **Source Integrity:** All original 29 routes, components, and 3D scenes remain functional and elevated in visual quality.
2. **Full-Stack Operation:** PostgreSQL database and Express backend seamlessly handle authentication, milestone updates, audits, and budget transactions.
3. **Verified Trust Model:** The application enforces the separation between contractor claims, independent inspection reports, and verified escrow releases.
4. **Leak-Free 3D Performance:** Three.js scene manager completely frees GPU resources on route change, maintaining smooth 60fps performance on target devices.
5. **Auditor-Grade UI:** Workspace views reflect high-density editorial architecture aesthetics, high-contrast typography, and print-ready report certificates.
