# WENSURE Full-Stack System Design & Trust Architecture

**Document Version:** 1.0.0  
**Status:** Architecture Blueprint  
**Author:** Staff-Level Systems Architect & Security Reviewer  
**Target Repository:** `WENSURE FINAL 1`  
**Date:** March 2026  

---

## 1. Architectural Vision & Principles

WENSURE bridges the systemic trust deficit in residential construction by functioning as an **objective, digital civil audit authority**. The architecture is guided by five foundational tenets:

1. **Incremental Evolution (Strangler Fig Strategy):**  
   The application preserves all existing React components, Three.js scenes, and demo data flows. A type-safe API client layer (`src/services/api/`) connects existing views to the backend without breaking client-only fallback operation.
2. **Strict Separation of Claim vs. Verification:**  
   Contractors submit claims and self-reported progress; independent field auditors verify physical reality. The system explicitly prevents any self-verification of milestones.
3. **Cryptographic Proof & Tamper Evident Evidence:**  
   All site photographs, engineering test certificates (cube compressive tests, soil bearing tests), and inspection checklists are cryptographically hashed (SHA-256) and anchored into an append-only audit log.
4. **Role-Based Least Privilege (RBAC):**  
   Strict authorization barriers prevent cross-tenant project leakage, unauthorized budget releases, or self-closing of structural safety observations.
5. **Offline-Resilient Dual-Mode Execution:**  
   The platform seamlessly operates in **Full-Stack Mode** (Express + PostgreSQL) with automated fallback to **Client Sandbox Mode** (`localStorage` + mock fixtures) whenever backend connectivity is absent.

---

## 2. Full-Stack System Topology

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT TIER (Browser)                             │
├──────────────────────────────────────────────────────────────────────────────────┤
│  React 19 + TypeScript + Vite 6 + Tailwind CSS                                    │
│  ├── Three.js Cinematic 3D Engine (Scroll-Driven WebGL Pipeline)                 │
│  ├── TanStack Query (Server State Cache, Invalidation & Optimistic Updates)      │
│  ├── Unified Router (React Router 7 with Protected Route Guards)                │
│  └── Dual-Mode Client Adapter (API Client with LocalStorage Fallback)            │
└─────────────────────────┬──────────────────────────────────▲─────────────────────┘
                          │ HTTPS / JSON REST API            │
                          ▼                                  │
┌────────────────────────────────────────────────────────────┴─────────────────────┐
│                            APPLICATION TIER (Node.js)                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│  Express.js + TypeScript 5.7 REST API Service                                     │
│  ├── Security Gateway: Helmet, CORS, Rate-Limiting, CSRF Protection             │
│  ├── Auth & Identity Engine: Argon2 Hashing, JWT Access Tokens, HttpOnly Cookies │
│  ├── RBAC Enforcement Middleware: Route-level permission matrices                │
│  ├── Trust & Verification State Machine: Milestone verification workflow         │
│  ├── EXIF & Geolocation Service: Site photo GPS bounding box validation          │
│  └── S3 Presigned URL Broker: Direct-to-storage zero-hop media uploads           │
└─────────────────────────┬──────────────────────────────────┬─────────────────────┘
                          │ SQL Queries                      │ Direct S3 Put/Get
                          ▼                                  ▼
┌──────────────────────────────────────┐   ┌───────────────────────────────────────┐
│           DATA TIER (PostgreSQL)     │   │      OBJECT STORAGE TIER (S3 / MinIO) │
├──────────────────────────────────────┤   ├───────────────────────────────────────┤
│  PostgreSQL 16 via Prisma ORM        │   │  Encrypted S3-Compatible Storage      │
│  ├── Multi-Tenant Relational Schema  │   │  ├── /evidence/photos/ (Site captures)│
│  ├── Append-Only Audit Trail Ledger  │   │  ├── /blueprints/ (CAD & PDF plans)   │
│  └── Full-Text Search Indexes        │   │  └── /reports/ (Generated Audit PDFs) │
└──────────────────────────────────────┘   └───────────────────────────────────────┘
```

---

## 3. Relational Data Model (Prisma Schema Specification)

The following schema defines the normalized PostgreSQL data structure, replacing client-side single-key `localStorage` storage:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ==========================================
// 1. IDENTITY & ACCESS CONTROL
// ==========================================

enum UserRole {
  CUSTOMER
  CONTRACTOR
  INSPECTOR
  ADMIN
  SUPER_ADMIN
}

model User {
  id                String             @id @default(uuid())
  email             String             @unique
  passwordHash      String
  fullName          String
  phone             String?
  role              UserRole           @default(CUSTOMER)
  avatarUrl         String?
  isActive          Boolean            @default(true)
  emailVerified     Boolean            @default(false)
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  contractorProfile ContractorProfile?
  projectMembers    ProjectMember[]
  auditLogs         AuditLog[]
  assignedAudits    InspectionReport[] @relation("InspectorAudits")
  submittedUpdates  WorkUpdateSubmission[]
  issueResponses    ObservationResponse[]

  @@index([email, role])
}

// ==========================================
// 2. PROJECT & PARTICIPANT REGISTER
// ==========================================

enum ProjectStatus {
  PLANNING
  ACTIVE
  ON_HOLD
  DISPUTED
  COMPLETED
}

model Project {
  id                   String              @id @default(uuid())
  code                 String              @unique // e.g. "PRJ-WEN-2026-084"
  name                 String
  tagline              String?
  clientName           String
  location             String
  city                 String
  state                String
  country              String              @default("India")
  latitude             Float?
  longitude            Float?
  plotAreaSqFt         Int
  builtUpAreaSqFt      Int
  status               ProjectStatus       @default(ACTIVE)
  overallProgressPct   Int                 @default(0)
  totalBudget          Decimal             @db.Decimal(12, 2)
  amountDisbursed      Decimal             @default(0.00) @db.Decimal(12, 2)
  escrowHoldAmount     Decimal             @default(0.00) @db.Decimal(12, 2)
  targetCompletionDate DateTime
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt

  members              ProjectMember[]
  milestones           Milestone[]
  inspections          InspectionReport[]
  transactions         BudgetTransaction[]
  photos               SitePhoto[]
  observations         ObservationIssue[]
  disputes             Dispute[]

  @@index([code, status])
}

model ProjectMember {
  id        String   @id @default(uuid())
  projectId String
  userId    String
  roleInProject String // "OWNER", "LEAD_CONTRACTOR", "FIELD_AUDITOR"
  joinedAt  DateTime @default(now())

  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
}

// ==========================================
// 3. TRUST MODEL: MILESTONE & VERIFICATION
// ==========================================

enum MilestoneStatus {
  PLANNED
  IN_PROGRESS
  REPORTED_BY_CONTRACTOR
  EVIDENCE_SUBMITTED
  INSPECTION_SCHEDULED
  INDEPENDENTLY_INSPECTED
  VERIFIED
  DISPUTED
}

model Milestone {
  id                 String             @id @default(uuid())
  projectId          String
  orderIndex         Int
  code               String             // e.g. "MS-01", "MS-02"
  title              String
  stage              String             // "Site Prep", "Substructure", "Superstructure", "Finishes"
  description        String
  plannedStartDate   DateTime
  plannedEndDate     DateTime
  actualStartDate    DateTime?
  actualEndDate      DateTime?
  completionPct      Int                @default(0)
  payoutAmount       Decimal            @db.Decimal(12, 2)
  status             MilestoneStatus    @default(PLANNED)
  isVerified         Boolean            @default(false)
  verifiedAt         DateTime?
  verifiedById       String?

  project            Project            @relation(fields: [projectId], references: [id], onDelete: Cascade)
  submissions        WorkUpdateSubmission[]
  inspections        InspectionReport[]
  observations       ObservationIssue[]

  @@index([projectId, orderIndex])
}

model WorkUpdateSubmission {
  id                 String             @id @default(uuid())
  milestoneId        String
  submittedById      String
  summary            String
  detailedNotes      String
  reportedPct        Int
  menOnSite          Int
  weatherConditions  String?
  submittedAt        DateTime           @default(now())

  milestone          Milestone          @relation(fields: [milestoneId], references: [id], onDelete: Cascade)
  submittedBy        User               @relation(fields: [submittedById], references: [id])
  evidencePhotos     EvidenceAttachment[]

  @@index([milestoneId, submittedAt])
}

model EvidenceAttachment {
  id                 String             @id @default(uuid())
  submissionId       String?
  inspectionId       String?
  photoId            String?
  fileUrl            String
  thumbnailUrl       String?
  fileSizeBytes      Int
  mimeType           String
  sha256Hash         String             // Cryptographic verification hash
  exifDateTime       DateTime?
  exifLatitude       Float?
  exifLongitude      Float?
  isGpsVerified      Boolean            @default(false)
  caption            String?
  createdAt          DateTime           @default(now())

  submission         WorkUpdateSubmission? @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  inspection         InspectionReport?     @relation(fields: [inspectionId], references: [id], onDelete: Cascade)

  @@index([sha256Hash])
}

// ==========================================
// 4. INDEPENDENT AUDITS & OBSERVATIONS
// ==========================================

enum InspectionRating {
  EXCELLENT
  SATISFACTORY
  CONCERNS_NOTED
  REJECTED
}

model InspectionReport {
  id                 String             @id @default(uuid())
  projectId          String
  milestoneId        String?
  reportNumber       String             @unique // e.g. "WEN-IR-2026-042"
  inspectorId        String
  title              String
  stage              String
  inspectionDate     DateTime
  rating             InspectionRating
  qualityScorePct    Int                // 0 to 100
  executiveSummary   String
  civilObservations  String
  pdfReportUrl       String?
  pdfSha256Hash      String?
  createdAt          DateTime           @default(now())

  project            Project            @relation(fields: [projectId], references: [id], onDelete: Cascade)
  milestone          Milestone?         @relation(fields: [milestoneId], references: [id])
  inspector          User               @relation("InspectorAudits", fields: [inspectorId], references: [id])
  checklistItems     InspectionChecklistItem[]
  observations       ObservationIssue[]
  evidence           EvidenceAttachment[]

  @@index([projectId, inspectionDate])
}

model InspectionChecklistItem {
  id                 String             @id @default(uuid())
  inspectionReportId String
  category           String             // "Concrete Quality", "Rebar Alignment", "Curing"
  itemText           String
  isCompliant        Boolean
  observedTolerance  String?            // e.g. "3mm / 3m span (Pass)"
  auditorNotes       String?

  report             InspectionReport   @relation(fields: [inspectionReportId], references: [id], onDelete: Cascade)
}

enum IssueSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum IssueStatus {
  OPEN
  CONTRACTOR_RESPONDED
  RE_INSPECTION_PENDING
  RESOLVED
  DISPUTED
}

model ObservationIssue {
  id                 String             @id @default(uuid())
  projectId          String
  milestoneId        String?
  inspectionReportId String?
  issueCode          String             // e.g. "OBS-014"
  title              String
  severity           IssueSeverity
  location           String
  description        String
  status             IssueStatus        @default(OPEN)
  rectificationPlan  String?
  resolvedAt         DateTime?
  createdAt          DateTime           @default(now())

  project            Project            @relation(fields: [projectId], references: [id], onDelete: Cascade)
  milestone          Milestone?         @relation(fields: [milestoneId], references: [id])
  inspectionReport   InspectionReport?  @relation(fields: [inspectionReportId], references: [id])
  responses          ObservationResponse[]

  @@index([projectId, status, severity])
}

model ObservationResponse {
  id                 String             @id @default(uuid())
  observationId      String
  responderId        String
  comment            String
  rectificationPhotoUrl String?
  photoSha256Hash    String?
  createdAt          DateTime           @default(now())

  observation        ObservationIssue   @relation(fields: [observationId], references: [id], onDelete: Cascade)
  responder          User               @relation(fields: [responderId], references: [id])
}

// ==========================================
// 5. BUDGET, ESCROW & AUDIT LOG LEDGER
// ==========================================

enum TransactionType {
  DEPOSIT
  ESCROW_HOLD
  ESCROW_RELEASE
  DIRECT_EXPENSE
  RETENTION_RESERVE
}

model BudgetTransaction {
  id                 String             @id @default(uuid())
  projectId          String
  txCode             String             @unique // e.g. "TXN-2026-089"
  date               DateTime
  description        String
  category           String             // "Civil", "Steel", "Escrow Release", "Auditor Fee"
  amount             Decimal            @db.Decimal(12, 2)
  type               TransactionType
  status             String             // "COMPLETED", "ESCROW_HELD", "PENDING_APPROVAL"
  relatedMilestoneId String?
  approvedByUserId   String?
  createdAt          DateTime           @default(now())

  project            Project            @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

model SitePhoto {
  id                 String             @id @default(uuid())
  projectId          String
  caption            String
  stage              String
  category           String             // "Foundation", "Columns", "Slab", "Finishes"
  url                String
  thumbnailUrl       String?
  capturedDate       DateTime
  sha256Hash         String
  gpsCoordinates     String?
  createdAt          DateTime           @default(now())

  project            Project            @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

model AuditLog {
  id                 String             @id @default(uuid())
  userId             String?
  projectId          String?
  action             String             // "MILESTONE_VERIFIED", "PAYMENT_RELEASED", "DEFECT_RESOLVED"
  entityType         String             // "Milestone", "InspectionReport", "BudgetTransaction"
  entityId           String
  previousStateJson  String?            @db.Text
  newStateJson       String             @db.Text
  ipAddress          String?
  userAgent          String?
  timestamp          DateTime           @default(now())

  user               User?              @relation(fields: [userId], references: [id])

  @@index([projectId, action, timestamp])
}

// ==========================================
// 6. CONTRACTOR DIRECTORY & REPUTATION
// ==========================================

model ContractorProfile {
  id                 String             @id @default(uuid())
  userId             String             @unique
  companyName        String
  tagline            String
  licenseNumber      String             @unique
  yearsExperience    Int
  completedProjects  Int                @default(0)
  verifiedScore      Float              @default(90.0) // 0 to 100
  qualityBadge       String             // "Grade A Verified Builder"
  specializations    String[]           // ["RCC Superstructure", "Luxury Finishes"]
  insuranceCoverage  Decimal            @db.Decimal(12, 2)
  panTaxId           String?
  gstinNumber        String?
  isVerified         Boolean            @default(false)
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt

  user               User               @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Dispute {
  id                 String             @id @default(uuid())
  projectId          String
  disputeNumber      String             @unique // e.g. "DSP-2026-004"
  title              String
  claimantRole       String             // "CUSTOMER" or "CONTRACTOR"
  disputedAmount     Decimal            @db.Decimal(12, 2)
  reason             String
  status             String             // "UNDER_MEDIATION", "ESCALATED", "RESOLVED"
  escrowFrozen       Boolean            @default(true)
  resolutionSummary  String?
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt

  project            Project            @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

---

## 4. Preserving WENSURE's Trust Model (Task 4)

WENSURE’s defining principle is the unbending distinction between self-reported work, independent audits, and financial releases. The data model and business logic strictly enforce the following state transition lifecycle:

```
                                  TRUST VERIFICATION STATE MACHINE
                                  
   [ 1. PLANNED ]  (Architectural specifications, schedule baseline, budget allocation)
          │
          │ Contractor initiates on-site activity
          ▼
  [ 2. IN_PROGRESS ]  (Daily progress, labor mobilization, material deliveries)
          │
          │ Contractor completes stage & uploads progress claim + photos
          ▼
[ 3. REPORTED_BY_CONTRACTOR ]
          │
          │ Automated photo pipeline verifies GPS boundaries + calculates SHA-256 hash
          ▼
[ 4. EVIDENCE_SUBMITTED ]
          │
          │ Operations / System assigns licensed independent civil engineer
          ▼
[ 5. INSPECTION_SCHEDULED ]
          │
          │ Field Auditor executes on-site checklist, laser measurement, core tests
          ▼
[ 6. INDEPENDENTLY_INSPECTED ]
          │
          ├─────────────────────────────────────────────────┐
          │ Passes all structural tolerances                │ Defect / Non-compliance identified
          ▼                                                 ▼
   [ 7. VERIFIED ]                                  [ DEFECT_FLAGGED ]
          │                                                 │
          │ Escrow disbursement authorized                  │ Contractor submits rectification proof
          ▼                                                 ▼
[ FUNDS DISBURSED TO CONTRACTOR ]                   [ RE-INSPECTION PENDING ]
                                                            │
                                                            │ Auditor conducts follow-up site visit
                                                            ▼
                                                    [ AUDITOR RESOLVED ] ──► Back to [ VERIFIED ]
```

### 4.1 Cryptographic & Engineering Integrity Safeguards
1. **Zero Self-Verification:** Under no circumstance can a user with role `CONTRACTOR` or `CUSTOMER` transition a milestone to `VERIFIED`. The endpoint `/api/v1/milestones/:id/verify` requires role `INSPECTOR` or `ADMIN` and mandates an associated `InspectionReportId`.
2. **GPS Geofence Validation:** When a contractor or auditor uploads site photos, the server extracts EXIF GPS tags. If the coordinate falls outside the project's registered bounding box radius (e.g. > 150m from site center), the photo is flagged as `UNVERIFIED_LOCATION`.
3. **Immutable SHA-256 Evidence Hashing:** Before an image is permanently stored in S3, its byte stream is hashed using SHA-256. This hash is permanently recorded in the `EvidenceAttachment` and `AuditLog` tables. If any photo is ever manipulated or swapped, the hash mismatch is immediately detected.
4. **Append-Only Audit Ledger:** All critical events (`MILESTONE_VERIFIED`, `DEFECT_RESOLVED`, `ESCROW_RELEASED`, `DISPUTE_RAISED`) generate a signed record in `AuditLog` storing the full prior JSON state, new JSON state, acting user ID, and IP address.

---

## 5. RESTful API Specification

The backend exposes a versioned, secure REST API under `/api/v1/`:

| Module | Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | Public | Register new user account |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | Authenticate user, return JWT & set HttpOnly refresh cookie |
| **Auth** | `POST` | `/api/v1/auth/refresh` | Public | Exchange refresh token for fresh access token |
| **Auth** | `POST` | `/api/v1/auth/logout` | Authenticated | Revoke refresh token and clear cookie |
| **Auth** | `GET` | `/api/v1/auth/me` | Authenticated | Retrieve authenticated user profile and roles |
| **Projects** | `GET` | `/api/v1/projects` | Authenticated | List accessible projects for current user role |
| **Projects** | `GET` | `/api/v1/projects/:id` | Project Member | Retrieve complete project graph (milestones, specs, team) |
| **Projects** | `PATCH` | `/api/v1/projects/:id` | Admin | Update project status, budget, or target completion |
| **Milestones** | `GET` | `/api/v1/projects/:id/milestones` | Project Member | List all milestones with verification state |
| **Milestones** | `POST` | `/api/v1/milestones/:id/submissions` | Contractor | Submit work update claim with evidence attachments |
| **Milestones** | `POST` | `/api/v1/milestones/:id/verify` | Inspector, Admin | Independently sign off and verify milestone completion |
| **Inspections** | `GET` | `/api/v1/projects/:id/inspections` | Project Member | Retrieve published independent audit reports |
| **Inspections** | `POST` | `/api/v1/inspections` | Inspector, Admin | Publish new independent civil engineering audit report |
| **Inspections** | `GET` | `/api/v1/inspections/:id/pdf` | Project Member | Download signed audit report PDF with hash signature |
| **Observations** | `GET` | `/api/v1/projects/:id/observations` | Project Member | Retrieve defect tracker items and resolution statuses |
| **Observations** | `POST` | `/api/v1/observations/:id/respond` | Contractor | Submit contractor rectification plan and photo proof |
| **Observations** | `POST` | `/api/v1/observations/:id/resolve` | Inspector, Admin | Verify rectification and close observation ticket |
| **Budget** | `GET` | `/api/v1/projects/:id/budget` | Project Member | Retrieve financial summary, escrow holds, and ledger |
| **Budget** | `POST` | `/api/v1/projects/:id/disbursements` | Customer, Admin | Approve milestone payment release from escrow |
| **Media** | `POST` | `/api/v1/media/presign-upload` | Authenticated | Generate secure S3 presigned PUT URL with size/type constraints |
| **Contractors** | `GET` | `/api/v1/contractors` | Authenticated | Browse verified contractor directory with audit ratings |
| **Audit Log** | `GET` | `/api/v1/projects/:id/audit-trail` | Customer, Admin | Retrieve immutable timestamped timeline of all verified events |

---

## 6. Authentication, RBAC & Security Architecture

### 6.1 Token Lifecycle Strategy
* **Access Tokens:** Short-lived (15 minutes), signed via RS256 or HS256, containing `userId`, `role`, and `accessibleProjectIds`. Transmitted in `Authorization: Bearer <token>` headers.
* **Refresh Tokens:** Long-lived (7 days), stored hashed in PostgreSQL, transmitted via `HttpOnly`, `SameSite=Strict`, `Secure` cookies. Revoked immediately upon logout or password reset.
* **Demo Sandbox Bypass:** To maintain the instant 1-click role switcher experience in development and presentation mode, the auth service provides a dedicated `/api/v1/auth/demo-login` endpoint that issues valid scoped tokens for pre-seeded demo identities (`Aarav Sharma`, `Rajesh Verma`, `Audit Operations`).

### 6.2 Role-Based Access Control (RBAC) Matrix

| Resource / Action | Customer (Homeowner) | Contractor | Inspector (Auditor) | Operations / Admin |
| :--- | :---: | :---: | :---: | :---: |
| **View Project Specifications** | Read | Read | Read | Read / Write |
| **Submit Milestone Work Claim** | — | **Create** | — | — |
| **Verify Milestone Completion** | — | — | **Execute** | **Execute** |
| **Publish Inspection Audit** | Read | Read | **Create** | **Create / Publish** |
| **Respond to Defect Notice** | Read | **Create** | Read | Read |
| **Close Defect Notice** | — | — | **Execute** | **Execute** |
| **Authorize Escrow Release** | **Authorize** | — | — | **Override / Execute** |
| **Access Master Audit Ledger** | Read | — | Read | Read / Export |

---

## 7. Local Development & Infrastructure Configuration

To support zero-configuration local development while mirroring production architecture, a standard `docker-compose.yml` provides local instances of PostgreSQL, MinIO (S3 compatible), and Redis:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: wensure_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: wensure_db
      POSTGRES_USER: wensure_user
      POSTGRES_PASSWORD: wensure_dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  minio:
    image: minio/minio:RELEASE.2024-02-26T09-34-56Z
    container_name: wensure_minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadminpassword
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  redis:
    image: redis:7-alpine
    container_name: wensure_redis
    restart: unless-stopped
    ports:
      - "6379:6379"

volumes:
  postgres_data:
  minio_data:
```

### 7.1 Database Seeding Strategy
A Prisma seed script (`prisma/seed.ts`) automatically populates the database with the complete canonical dataset matching [`src/data/demoData.ts`](file:///c:/Users/Bharat%20Thakur/OneDrive/Desktop/AI/WENSURE%20FINAL%201/src/data/demoData.ts):
* **Project:** "The Baner Modern Villa" (`PRJ-WEN-2026-084`), 3,850 sq.ft, ₹1.45 Cr budget.
* **Users:** 
  * Homeowner: Aarav Sharma (`aarav.sharma@example.com`)
  * General Contractor: Rajesh Verma (`rajesh@vermaconstructions.in`)
  * Civil Lead Auditor: Vikram Malhotra (`vikram.malhotra@wensure.in`)
  * Operations Administrator: Audit Ops (`audit-ops@wensure.in`)
* **Milestones:** Complete 6-stage lifecycle (Site Preparation through Final Handover).
* **Inspections & Checklists:** Reports for Plinth & Footing verification (Score 94%) and First Floor RCC inspection (Score 91%).
