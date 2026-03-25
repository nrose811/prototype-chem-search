# Search & Demo Data Implementation Plan

Based on [ESig augment instructions](https://tetrascience.atlassian.net/wiki/spaces/~7120206a929d948afe44fcb4177c1f39dc3042/pages/5775032371/ESig+augment+instructions)

## Overview

Create three saved searches with supporting demo data, all accessible from the home page, to enable a complete e-signature demo flow.

---

## Phase 1: Demo Data Generation (`demoData.ts`)

### 1A. 100 Unsigned Example Files
- Create a new exported array `UNSIGNED_FILES` in `demoData.ts`
- Each file has: `fileId`, `fileName`, `sourceSystem`, `versionId`, `sha256`, `assayType`, `uploadedAt`
- **No** `esign_manifest` metadata on any of these files
- Variety of source systems (Empower CDS, MassLynx, Chromeleon, UNICORN, etc.)
- Variety of assay types (Potency, Purity, Identity, Stability, Dissolution, etc.)
- Realistic file names following pharma naming conventions

### 1B. 10 Signed Example Files
- Create a new exported array `SIGNED_FILES` in `demoData.ts`
- Each file has all standard fields **plus** an `esignManifest` property:
  ```ts
  esignManifest: { version: string; status: 'signed'; timestamp: string }
  ```
- These represent files that have already been through the e-signature process
- Different signers, dates, and assay types for variety

### 1C. 10 eSignature Report PDFs
- Create a new exported array `ESIGN_REPORT_FILES` in `demoData.ts`
- Each is a PDF file (fileType: 'pdf') — a **direct file**, not embedded in the CRO or any other app
- **No** `esign_manifest` metadata on these files
- Each has a `signedFileId` metadata label linking back to its corresponding signed file (from 1B)
- File names like: `eSignature-Report-{BatchId}.pdf`

### Data Model Extension
```ts
export interface DemoFile {
  fileId: string;
  fileName: string;
  sourceSystem: string;
  versionId: string;
  sha256: string;
  assayType: string;
  uploadedAt: string;
  fileType?: 'document' | 'pdf';
  esignManifest?: { version: string; status: 'signed'; timestamp: string } | null;
  signedFileId?: string;  // For report PDFs — links to the signed file
}
```

---

## Phase 2: Search Results Integration (`SearchResultsPage.tsx`)

### 2A. Query-Aware Search Results
- Accept a `searchCategory` parameter via navigation state: `'unsigned'`, `'signed'`, `'reports'`
- When `searchCategory` is set, display the corresponding dataset from `demoData.ts`
- Add an `esign_manifest` column (conditionally visible) for signed file results
- Add a `signedFileId` column for report file results

### 2B. Row Click → File Details
- Clicking a row navigates to `/details/{fileId}` passing file data as navigation state
- The `FileDetailsPage` already handles displaying `esign_manifest` for signed files

---

## Phase 3: Saved Searches on Home Page (`HomePage.tsx`)

### 3A. Add Three Saved Searches
Replace existing placeholder saved searches with:

| # | Title | Search Category | Icon |
|---|-------|----------------|------|
| 1 | Files without signature | `unsigned` | SearchIcon |
| 2 | GxP Signed files | `signed` | SearchIcon (with badge) |
| 3 | eSignature Reports | `reports` | PdfIcon |

### 3B. Navigation
- Each saved search links to `/search-results` with `{ searchCategory }` in navigation state
- The `SearchResultsPage` reads this state and displays the appropriate dataset

---

## Phase 4: File Details Page Updates (`FileDetailsPage.tsx`)

### 4A. Support Demo Files
- When `FileDetailsPage` receives a `fileId` matching one of the demo files (unsigned, signed, or report), render the appropriate attributes
- For signed files: show the `esign_manifest` JSON label (already implemented)
- For report PDFs: show `signedFileId` as a clickable link to the source signed file

### 4B. "Open in eSignature App" Button
- For unsigned files (no `esign_manifest`), show an "Open in eSignature App" action button
- Clicking navigates to `/apps/esign/{fileId}` with the file data passed as state
- The `ESignAppPage` should accept and display this file's information

---

## Phase 5: eSign App Integration (`ESignAppPage.tsx`)

### 5A. Accept External Files
- When navigating to `/apps/esign/:fileId` with a file from the demo data:
  - Display that file's info in the file information pane
  - Allow signing the file
  - On signature: update the file's status in the in-memory data store

### 5B. Post-Signature Updates
- After signing, add `esign_manifest` metadata to the file (move it from unsigned → signed pool)
- Generate a new eSignature report PDF and add it to the reports pool
- Both should now appear in their respective saved searches

---

## Phase 6: Demo Flow Verification

Complete demo flow:
1. ✅ Start on home page
2. ✅ Click "Files without signature" saved search
3. ✅ Click a file in search results → file details page
4. ✅ From file details, click "Open in eSignature App"
5. ✅ eSignature app opens with that file's information
6. ✅ Apply signature → eSignature report generated
   - Report viewable within the app
   - Report created as new file, appears in "eSignature Reports" search
7. ✅ Navigate back to home → click "GxP Signed files" search
8. ✅ Newly signed file appears in results
9. ✅ Click file → file details page shows esignature attributes

---

## File Changes Summary

| File | Changes |
|------|---------|
| `demoData.ts` | Add `DemoFile` interface, 100 unsigned files, 10 signed files, 10 report PDFs |
| `SearchResultsPage.tsx` | Handle `searchCategory` state, render demo data sets |
| `HomePage.tsx` | Replace saved searches with 3 eSign-focused ones |
| `FileDetailsPage.tsx` | Support demo file lookup, "Open in eSignature App" button |
| `ESignAppPage.tsx` | Accept external file via route param, post-sign data updates |
| `reportService.ts` | Register report files dynamically post-signature |

---

## Implementation Order
1. Phase 1 (data) → Phase 3 (home page) → Phase 2 (search results) → Phase 4 (file details) → Phase 5 (eSign app) → Phase 6 (verify)

