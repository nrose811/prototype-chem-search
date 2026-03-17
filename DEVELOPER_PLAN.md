## e-Signature Prototype Developer Plan

### Objective
Build a clickable prototype that demonstrates the end-to-end e-signature workflow for CRO data review: review data, apply signature, generate a signed artifact, and verify the event in platform-facing record views.

### Prototype success criteria
- A user can review a CRO batch in-app and understand what they are signing.
- A user can complete a signature challenge with meaning + credentials.
- The app produces a human-readable signed report tied to a specific data version.
- The platform surfaces the signature in File Details and Audit Trail views.
- The demo is reliable enough for customer feedback sessions.

---

## Architecture decisions (confirmed)

| Decision | Choice |
|----------|--------|
| **Base app shell** | Clone `54321jenn/tetra-scientist` (React 18 + Vite + TypeScript, Yarn workspaces) |
| **CRO data review app** | Rebuild `tetrascience/ts-data-app-cro-data-review` (Streamlit) as React pages inside the tetra-scientist shell |
| **Integration model** | CRO app appears as a clickable card on the existing `AppsPage`, opens as native React routes inside the platform shell |
| **Signed artifact format** | HTML (printable page); PDF deferred |
| **File Details / Audit Trail** | Extend the existing `FileDetailsPage` in the shell; add Audit Trail as a new page |
| **Data** | All mock — no live TDP API calls |
| **Auth** | Simulated challenge (hardcoded user + password gate) |

---

## Source repos

### tetra-scientist — the platform shell
- **Repo:** `https://github.com/54321jenn/tetra-scientist` (branch: `master`)
- **Stack:** React 18, Vite, TypeScript, React Router, Express backend, Yarn 4 workspaces
- **Key paths:**
  - `packages/client/src/App.tsx` — router with persona-based routing (scientist / IT)
  - `packages/client/src/pages/AppsPage.tsx` — where CRO app card will be added
  - `packages/client/src/pages/FileDetailsPage.tsx` — extend with signature badge
  - `packages/client/src/pages/HomePage.tsx` — add pending review banner/card
  - `packages/client/src/components/Layout.tsx` — main scientist layout
  - `packages/client/src/components/CustomSidebar.tsx` — sidebar navigation
  - `packages/server/` — Express backend (mock API endpoints go here)
- **Existing pages we reuse:** HomePage, AppsPage, FileDetailsPage, SearchPage
- **Component library:** `@tetrascience-npm/tetrascience-react-ui`

### ts-data-app-cro-data-review — the CRO app to rebuild
- **Repo:** `https://github.com/tetrascience/ts-data-app-cro-data-review` (branch: `main`)
- **Stack:** Python, Streamlit, Plotly, Pandas
- **Key files:**
  - `ts_data_app_cro_data_review/main.py` — the full app logic
  - `ts_data_app_cro_data_review/utils.py` — API client, auth, file parsing
- **Features to port to React:**
  - Search by review status (Pending / Approved / Rejected)
  - File list table with assay type filtering
  - Parsed assay results display
  - Plotly scatter chart comparing current vs historical data
  - Approve / Reject buttons that update file labels
- **Features we add on top (e-signature):**
  - Signature modal with meaning + credential challenge
  - Signed report generation
  - GxP Signed badge on File Details
  - Audit Trail events

---

## Scope

### In scope
- Clone tetra-scientist as the prototype base
- Add "CRO Data Review" app card on AppsPage
- Build CRO data review experience as React pages (search, table, chart, review)
- Add pending review entry point on HomePage
- Reusable signature modal/widget
- Happy-path signature submission flow
- Failed-auth state for credibility
- Signed report view (HTML, printable)
- File Details page with `GxP Signed` badge and signature metadata
- Audit Trail page with signature-specific events
- Mock integrity/hash verification display
- All mock data — no live API calls

### Out of scope
- Real IdP/Okta/SAML/OIDC integration
- Production cryptographic signing
- Multi-signer orchestration
- Real RBAC admin tooling
- Account locking and advanced policy enforcement
- Production-grade backend/API hardening
- Running the original Streamlit app or iframe embedding

---

## Proposed architecture

### New pages to create
1. **CRODataReviewPage** (`packages/client/src/pages/CRODataReviewPage.tsx`)
   - Search files by review status
   - Assay type filtering
   - File results table
   - Parsed assay results display
   - Plotly chart (current vs historical)
   - `Sign and Approve Batch` CTA (replaces simple Approve/Reject)
2. **SignedReportPage** (`packages/client/src/pages/SignedReportPage.tsx`)
   - Human-readable signed artifact
   - Print stylesheet for "certified copy" look
3. **AuditTrailPage** (`packages/client/src/pages/AuditTrailPage.tsx`)
   - Signature event rows with expandable details

### Existing pages to modify
1. **AppsPage** — add CRO Data Review card that navigates to `/apps/cro-data-review`
2. **HomePage** — add "Pending Reviews" card/banner linking to the CRO app
3. **FileDetailsPage** — add `GxP Signed` badge, signature metadata panel, signed report link
4. **App.tsx** — add routes for new pages

### New components to create
1. **SignatureWidget** (`packages/client/src/components/SignatureWidget.tsx`)
   - Modal with meaning dropdown, user ID display, password input
   - States: idle, validating, failed, success
2. **ReviewSummary** (`packages/client/src/components/ReviewSummary.tsx`)
   - Batch metadata, version indicator, CRO/study context
3. **FileManifestTable** (`packages/client/src/components/FileManifestTable.tsx`)
   - Table of files with name, source, version, hash
4. **AssayResultsTable** (`packages/client/src/components/AssayResultsTable.tsx`)
   - Parsed assay results (ported from Streamlit `st.dataframe`)
5. **HistoricalComparisonChart** (`packages/client/src/components/HistoricalComparisonChart.tsx`)
   - Plotly scatter chart (ported from Streamlit Plotly integration)
6. **AuditEventList** (`packages/client/src/components/AuditEventList.tsx`)
   - Event rows with expansion
7. **SignatureBadge** (`packages/client/src/components/SignatureBadge.tsx`)
   - `GxP Signed` badge for File Details

### Supporting services (mock, client-side)
- **signatureService** (`packages/client/src/services/signatureService.ts`)
  - Accepts signature payloads, validates mock credentials, returns signed event
- **reportService** (`packages/client/src/services/reportService.ts`)
  - Generates report metadata for the signed artifact
- **auditService** (`packages/client/src/services/auditService.ts`)
  - Records and retrieves `APPLIED`, `FAILED`, `REVOKED` events
- **integrityService** (`packages/client/src/services/integrityService.ts`)
  - Stores hash/version pairs and returns verification status

### Mock data
- **demoData** (`packages/client/src/mocks/demoData.ts`)
  - One CRO batch with 3–5 files
  - One demo user (e.g., `Dr. Sarah Chen`, `schen@pharma.com`)
  - Assay results for each file
  - Pre-seeded audit events
  - Signature meanings: `Review and Approval`, `Verified for Accuracy`, `Acknowledged`

## Data model for prototype

### Batch / review context
- `batchId`
- `batchName`
- `croName`
- `studyId`
- `appVersion`
- `datasetVersion`
- `status` (`PENDING_SIGNATURE`, `SIGNED`)

### File manifest item
- `fileId`
- `fileName`
- `sourceSystem`
- `versionId`
- `sha256`

### Signature record
- `signatureId`
- `signerName`
- `userId`
- `timestamp`
- `timezone`
- `meaning`
- `authenticationMethod`
- `datasetVersion`
- `reportId`
- `status`

### Audit event
- `eventId`
- `eventType`
- `userId`
- `timestamp`
- `result`
- `datasetVersion`
- `reason`
- `origin`

## Implementation phases

### Phase 1: Bootstrap — clone tetra-scientist and add routing

#### Tasks

- Clone `54321jenn/tetra-scientist` into this repo
- Verify the app builds and runs locally (`yarn install && yarn dev`)
- Add new routes to `App.tsx`:
  - `/apps/cro-data-review` → `CRODataReviewPage`
  - `/apps/cro-data-review/report/:reportId` → `SignedReportPage`
  - `/audit-trail` → `AuditTrailPage`
- Create stub pages for each new route
- Create `packages/client/src/mocks/demoData.ts` with seeded mock data

#### Deliverables

- App runs locally with all routes navigable
- Mock data available for downstream phases

#### Acceptance criteria

- `yarn dev` starts without errors
- All new routes render stub content
- Existing tetra-scientist pages still work

---

### Phase 2: Build the CRO Data Review page

#### Tasks

- Add "CRO Data Review" card to `AppsPage` with navigation to `/apps/cro-data-review`
- Add "Pending Reviews" card to `HomePage` linking to the CRO app
- Build `CRODataReviewPage` with:
  - Review status selector (Pending / Approved / Rejected)
  - File results table with assay type filtering (port from Streamlit `st.data_editor`)
  - Parsed assay results table (port from Streamlit `st.dataframe`)
  - Plotly scatter chart — current vs historical (port from Streamlit `st.plotly_chart`)
- Build supporting components:
  - `ReviewSummary` — batch metadata, version, CRO/study context
  - `AssayResultsTable` — parsed results display
  - `FileManifestTable` — file list with name, source, version, hash
  - `HistoricalComparisonChart` — Plotly scatter with mock historical data
- Add `Sign and Approve Batch` CTA (replaces Streamlit's simple Approve/Reject)

#### Deliverables

- CRO Data Review page looks credible and explains what is being reviewed
- Chart renders with realistic mock data

#### Acceptance criteria

- User can navigate from AppsPage → CRO Data Review
- User can filter files and see assay results
- User can identify CRO, study, files, and data version before signing

---

### Phase 3: Build the signature widget

#### Tasks

- Create `SignatureWidget` modal component
- Required fields:
  - Signature meaning dropdown (e.g., `Review and Approval`, `Verified for Accuracy`)
  - User ID (read-only, pre-filled from demo user)
  - Password input
- Implement states: idle, validating, failed auth, success
- Create `signatureService` mock:
  - Valid credentials: `password123` (hardcoded for demo)
  - Returns signature record on success
  - Returns error on failure
- On success:
  - Update batch status to `SIGNED` in local state
  - Write audit event via `auditService`
  - Navigate to signed report or show success confirmation

#### Deliverables

- Reusable `SignatureWidget` component

#### Acceptance criteria

- Happy path: correct password → success state → signature metadata returned
- Failure path: wrong password → error message, no state change
- Signature widget can be used from any page (reusable)

---

### Phase 4: Generate the signed report

#### Tasks

- Build `SignedReportPage` as a printable HTML page
- Report content:
  - Report ID and generation timestamp
  - App name/version
  - CRO name, study/project ID
  - File manifest table (file name, source system, version ID, SHA-256 hash)
  - Key result summary
  - Signature footer: signer name, timestamp with timezone, reason/meaning, user ID, auth method
- Add print stylesheet for "certified copy" appearance
- Create `reportService` mock that generates report metadata
- Add `View Signed Report` navigation from signature success state

#### Deliverables

- Human-readable signed artifact tied to reviewed version

#### Acceptance criteria

- Report shows signer, date/time, meaning, user ID, file/version context, report ID
- Page prints cleanly via browser print dialog

---

### Phase 5: Build platform verification views

#### Tasks

- Extend `FileDetailsPage`:
  - Add `GxP Signed` badge (via `SignatureBadge` component)
  - Add signature metadata panel (signer, date, meaning)
  - Add link to signed report
  - Show version/hash information
  - Add "Verify Integrity" button with mock pass/fail
- Build `AuditTrailPage`:
  - Signature-specific event rows: `E-Signature Applied`, `E-Signature Failed`
  - Expandable detail showing: user, timestamp, meaning, dataset version, originating app
  - Pre-seeded events plus any events from the current session
- Create `AuditEventList` component
- Create `integrityService` mock

#### Deliverables

- Platform-facing verification experience

#### Acceptance criteria

- File Details shows the signature badge and metadata after signing
- Audit Trail shows the signature event with correct details
- User can verify the signature outside the CRO app context

---

### Phase 6: Demo hardening

#### Tasks

- Add empty/loading/error states where needed
- Polish timestamps, labels, and copy for customer-readiness
- Add a demo reset mechanism (clear local state, re-seed data)
- Validate the full demo script end-to-end
- Ensure deterministic behavior (no randomness that breaks the demo)

#### Deliverables

- Stable prototype for internal and customer walkthroughs

#### Acceptance criteria

- Demo can be completed cleanly in under 5 minutes
- Reset returns to a clean starting state

---

## File/component map

```
packages/client/src/
├── App.tsx                                    # Add new routes
├── mocks/
│   └── demoData.ts                            # NEW — all mock data
├── services/
│   ├── signatureService.ts                    # NEW — mock signature logic
│   ├── reportService.ts                       # NEW — mock report generation
│   ├── auditService.ts                        # NEW — mock audit event store
│   └── integrityService.ts                    # NEW — mock hash verification
├── components/
│   ├── SignatureWidget.tsx                     # NEW — reusable signature modal
│   ├── SignatureWidget.css                     # NEW
│   ├── ReviewSummary.tsx                       # NEW — batch context display
│   ├── AssayResultsTable.tsx                   # NEW — parsed results table
│   ├── FileManifestTable.tsx                   # NEW — file list table
│   ├── HistoricalComparisonChart.tsx           # NEW — Plotly chart
│   ├── AuditEventList.tsx                      # NEW — audit event rows
│   ├── SignatureBadge.tsx                      # NEW — GxP Signed badge
│   └── ... (existing components unchanged)
├── pages/
│   ├── CRODataReviewPage.tsx                   # NEW — CRO app rebuilt in React
│   ├── CRODataReviewPage.css                   # NEW
│   ├── SignedReportPage.tsx                    # NEW — signed artifact view
│   ├── SignedReportPage.css                    # NEW
│   ├── AuditTrailPage.tsx                      # NEW — audit trail view
│   ├── AuditTrailPage.css                      # NEW
│   ├── AppsPage.tsx                            # MODIFY — add CRO app card
│   ├── HomePage.tsx                            # MODIFY — add pending review card
│   ├── FileDetailsPage.tsx                     # MODIFY — add signature badge/panel
│   └── ... (other existing pages unchanged)
```

---

## Testing plan

### Unit tests (Vitest — already configured)

- SignatureWidget form validation and state transitions
- signatureService mock credential check
- reportService metadata generation
- auditService event recording and retrieval
- SignatureBadge conditional rendering

### Integration tests

- CRODataReviewPage → SignatureWidget → success → navigation to signed report
- Signature success → FileDetailsPage shows GxP Signed badge
- Signature success → AuditTrailPage shows new event
- Signature failure → no state change, error displayed

### Smoke test checklist

1. Navigate to AppsPage → click CRO Data Review card
2. Filter by Pending status → select a file → view assay results
3. Click `Sign and Approve Batch`
4. Enter wrong password → see error
5. Enter correct password → see success
6. View signed report → verify all fields
7. Navigate to File Details → see `GxP Signed`
8. Navigate to Audit Trail → see signature event

---

## Demo script

1. Land on HomePage → see "Pending Reviews" card
2. Click through to CRO Data Review app (or go via AppsPage)
3. Review CRO Alpha batch — see assay results and comparison chart
4. Click `Sign and Approve Batch`
5. Select meaning: "Review and Approval of CRO Results"
6. Enter credentials (show failed attempt first for credibility)
7. Enter correct credentials → success
8. View signed report (printable HTML)
9. Navigate to File Details → point out `GxP Signed` badge and metadata
10. Navigate to Audit Trail → show immutable signature event with details

---

## Risks and mitigations

- **Risk:** Overbuilding compliance details slows feedback.
  - **Mitigation:** Simulate auth/integrity; prioritize believable UX.
- **Risk:** Porting Streamlit features to React takes longer than expected.
  - **Mitigation:** Start with table + chart only; skip advanced filtering if needed.
- **Risk:** Report generation becomes a rabbit hole.
  - **Mitigation:** Start with printable HTML; add PDF only if easy.
- **Risk:** tetra-scientist clone has dependencies that don't install cleanly.
  - **Mitigation:** Resolve on first `yarn install`; strip unused features if needed.

---

## Resolved decisions

| Decision | Resolution |
|----------|-----------|
| Base stack | Clone `54321jenn/tetra-scientist` |
| CRO app integration | Rebuild in React (not iframe) |
| Signed artifact format | HTML first, PDF deferred |
| File Details + Audit Trail | Inside the same app shell, native routes |
| Demo user | `Dr. Sarah Chen` / `schen@pharma.com` (pending confirmation) |
| Signature meanings | `Review and Approval`, `Verified for Accuracy`, `Acknowledged` (pending confirmation) |

---

## First implementation milestone

Deliver a single happy-path flow with:

- One pending review item on HomePage
- CRO Data Review page with file table and chart
- Signature modal with success + failure states
- Signed report page
- GxP Signed badge on File Details
- Signature event on Audit Trail

If that flow works end-to-end, the prototype is ready for initial stakeholder feedback.