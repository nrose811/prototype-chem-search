# eSign App — Implementation Plan

> **Source:** [eSign App Context for Augment](https://tetrascience.atlassian.net/wiki/x/BYCYVwE)

---

## Overview

Create a new **eSign App** accessible from the File Details "Open" dropdown. The app provides a focused, two-pane review environment where a scientist can inspect a file's source data alongside its parsed/insight view, then apply a compliant e-signature — all within a single screen.

---

## Phase 1: Route, Page Shell & Header

**Goal:** Scaffold the page and wire it into the app.

1. Create `ESignAppPage.tsx` + `ESignAppPage.css` in `packages/client/src/pages/`.
2. Add route `apps/esign/:fileId` in `App.tsx` (inside the scientist `<Layout>` block).
3. Update the "eSignature" item in the File Details "Open" dropdown to navigate to `/apps/esign/{fileId}` instead of being a disabled placeholder.
4. **Header bar** — render:
   - **File name** and **Source Type** (e.g. "Empower") pulled from existing `DEMO_BATCH.files` by `fileId`.
   - **Unique ID** (the `fileId`).
   - **Status Badge**: `Pending Review`, `In Progress`, or `Signed` (driven by local state + `esign_manifest` logic — see Phase 5).
   - **Audit Trail link**: a `<Link>` back to `/audit-trail`.

---

## Phase 2: Multi-Pane Review Workspace

**Goal:** Build the two-pane layout described in the Confluence page.

1. **Left Pane — "Source"**
   - Read-only preview of the raw file.
   - Reuse the existing `SpreadsheetViewer` component for tabular data (already used on `FileDetailsPage`).
   - For non-spreadsheet files, show a simple text/JSON preview or a "Preview not available" placeholder.
2. **Right Pane — "Insight"**
   - A parsed results table showing the assay results for this file (filter `DEMO_BATCH.assayResults` by `fileId`).
   - Columns: Sample ID, Analyte, Result, Unit, Specification, Pass/Fail status.
   - This lets the reviewer confirm the Data Lake version matches the source.
3. **Layout:** CSS grid or flexbox, 50/50 split, with a draggable divider (stretch goal — not required for v1).

---

## Phase 3: eSignature Integration

**Goal:** Wire up the existing `SignatureWidget` modal.

1. Add a prominent **"Sign and Approve"** button in the header (same pattern as CRO Data Review).
2. On click, open `<SignatureWidget>` with the file's `batchId` and `datasetVersion`.
3. On success:
   - Update the header status badge to `Signed`.
   - Store the `SignatureRecord` in component state.
   - Show a "View Signed Report" button (links to a report page — Phase 4).

---

## Phase 4: Audit Trail Tab

**Goal:** Add an in-app "Compliance Timeline" below the review panes.

1. Create a collapsible **Audit Trail** section at the bottom of the page.
2. Render a table with columns: **Event Type**, **Actor**, **Timestamp**, **Change Detail**.
3. Populate with mock data matching the Confluence spec:
   - `File Created` → System Agent
   - `Label Added` → j.doe@lab.com → `esign:status` set to `Signed`
   - `File Updated` → s.smith@lab.com → New Version (v2) Detected
   - `Label Changed` → Integrity-Bot → `esign:status` reset to `Pending`
4. When the user signs (Phase 3), append a new `E-Signature Applied` row dynamically.

---

## Phase 5: Version-ID Keying & esign_manifest Metadata

**Goal:** Implement the "Version-ID Keying" strategy from the Confluence page.

1. Define an `ESignManifest` interface:
   ```ts
   interface ESignManifest {
     version: string;   // e.g. "v1"
     status: 'pending' | 'signed';
     timestamp: string; // ISO 8601
   }
   ```
2. Store the manifest in component state (simulating a metadata label on the file).
3. **Signing logic:** When a signature is applied, set `status: 'signed'` and pin the current `version`.
4. **Mismatch detection:** If the `file_version` from the URL/route doesn't match the manifest's `version`, show an **"Unsigned / Review Required"** warning banner — even if a previous version was signed.
5. Add a mock "version selector" dropdown in the header so the demo can show the mismatch behavior.

---

## File Summary

| File | Action |
|------|--------|
| `packages/client/src/pages/ESignAppPage.tsx` | **Create** — main page component |
| `packages/client/src/pages/ESignAppPage.css` | **Create** — styles |
| `packages/client/src/App.tsx` | **Edit** — add route |
| `packages/client/src/pages/FileDetailsPage.tsx` | **Edit** — wire "eSignature" dropdown item |

---

## Out of Scope (for now)

- PDF report generation for the eSign app (can reuse `SignedReportPage` pattern later).
- Real API calls to `GET /audit-trail` (mock data only).
- Draggable pane divider.
- Sequential / multi-party signing workflows.

---

## Demo Flow

1. Navigate to any file → File Details page.
2. Click **Open ▾** → **eSignature**.
3. Land on the eSign App: see source data (left) and parsed results (right).
4. Review the Audit Trail timeline at the bottom.
5. Click **Sign and Approve** → modal appears → authenticate → signature applied.
6. Status badge flips to **Signed**, audit trail updates, "View Signed Report" appears.
7. Switch version to v2 → banner warns "Unsigned / Review Required".

