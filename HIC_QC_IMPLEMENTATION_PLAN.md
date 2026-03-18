# HIC QC Data App — Implementation Plan

## Overview

The HIC QC app is a Hydrophobic Interaction Chromatography quality control application with a 3-step workflow:

1. **Sample Set Selection** — filter/select sample sets for review
2. **QC Details** — review chromatograms, peak data, and override classifications
3. **Summary & Submission** — review decisions, add comments, submit

We'll port a simplified version into the prototype shell, replace backend API calls with mock data, and integrate the e-signature workflow at the Summary step (replacing the "Submit to TDP" action with "Sign and Approve").

## Key Decisions

| Decision | Approach |
|----------|----------|
| MUI dependency | Must add `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` — the HIC QC pages use MUI extensively and converting to raw CSS would be impractical |
| Plotly.js / chromatograms | Simplify — use static mock chart images or a simple SVG representation instead of `react-plotly.js` (heavy dependency). Can add later if needed |
| Backend API calls | Replace with mock data service that returns hardcoded HIC sample sets |
| Navigation context | Create a simplified `HicNavigationContext` to manage workflow state across pages |
| E-signature integration | Add the existing `SignatureWidget` to the Summary page, generate a Certified Copy report on sign |

## Phases

### Phase 1: Dependencies & Scaffolding

- Install MUI packages (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`)
- Add HIC QC app card to `AppsPage.tsx`
- Add routes to `App.tsx`:
  - `/apps/hic-qc` → `HicQcSampleSelectionPage`
  - `/apps/hic-qc/details` → `HicQcDetailsPage`
  - `/apps/hic-qc/summary` → `HicQcSummaryPage`
  - `/apps/hic-qc/report/:reportId` → `SignedReportPage` (reuse existing)
- Create `HicNavigationContext` for cross-page state

### Phase 2: Mock Data

- Add HIC-specific mock data to `demoData.ts`:
  - 2-3 sample sets with samples, peak data, QC statuses
  - Mock chromatogram placeholder data
  - File manifest entries for the HIC data files

### Phase 3: Port Pages (Simplified)

- **HicQcSampleSelectionPage** — Table of sample sets with date filters, checkboxes, QC status chips, Continue button
- **HicQcDetailsPage** — Sample table with peak data columns, QC status, mock chromatogram placeholders, override/fail actions
- **HicQcSummaryPage** — Summary statistics, sample set table, comments field, "Sign and Approve" button (using `SignatureWidget`)

### Phase 4: E-Signature Integration

- Wire `SignatureWidget` into the Summary page
- On successful sign → generate Certified Copy report (reuse `reportService`)
- Add "View Signed Report" and "View Audit Trail" post-signature CTAs
- Update audit trail to include HIC QC signature events

### Phase 5: Polish & Deploy

- Verify all routes work, navigation flows correctly
- Update the Home page to show HIC QC as a pending review (like CRO)
- Test Vercel deployment

## Files to Create/Modify

| File | Action |
|------|--------|
| `packages/client/src/pages/HicQcSampleSelectionPage.tsx` | Create |
| `packages/client/src/pages/HicQcDetailsPage.tsx` | Create |
| `packages/client/src/pages/HicQcSummaryPage.tsx` | Create |
| `packages/client/src/contexts/HicNavigationContext.tsx` | Create |
| `packages/client/src/mocks/demoData.ts` | Modify — add HIC mock data |
| `packages/client/src/App.tsx` | Modify — add HIC routes |
| `packages/client/src/pages/AppsPage.tsx` | Modify — add HIC QC card |
| `packages/client/src/pages/HomePage.tsx` | Modify — add HIC pending review card |
| `packages/client/src/services/reportService.ts` | Modify — support HIC report generation |

## Estimated Scope

~8-10 new/modified files, largely following the patterns already established by the CRO Data Review integration.

