# Compound Search Redesign — Plan

Branch: `feat/compound-search-redesign`. All work isolated here; `main` untouched. Revert = don't merge / revert PR.

## Goal
Align the prototype's compound search flow with UX/design patterns from the Takeda crystallization React app (`react-main` branch), **without** adopting its crystallization domain data or its Tailwind stack. Keep current styling (MUI + per-component CSS).

## Locked decisions
1. **Card data scope**: visual style only. Show **structure-derived descriptors + registration/identity tags** typical of an SDF/MOL file. NO assay/experimental or catalog data.
   - DROP from reference card: Hansen Solubility Parameters (δD/δP/δH), melting point, boiling point, density, heat of fusion, supplier, physical-state badge.
2. **Multi-card layout**: responsive grid (2-up on wide, 1-up on narrow), all cards expanded.
3. **Styling**: current MUI + per-component CSS. No Tailwind, no TS-UI upgrade.
4. **Safety**: feature branch + PR.

## Reference card content (the reusable `CompoundCard`)
- Header: compound name, synonym chip, Compound ID.
- Stat tiles: Formula · MW · CAS · InChIKey (or exact mass).
- SMILES code block (mono, accent bar).
- Left section "Molecular Descriptors": MW, exact mass, heavy atoms, rings (aromatic/aliphatic), stereocenters, fraction Csp3, formal charge.
- Right section "Drug-Likeness": LogP, TPSA, HBA, HBD, rotatable bonds → Lipinski Rule of 5 banner + chips (keep existing).
- Structure render top-right with zoom affordance.

## Work items (feedback → files)
All flow logic currently lives in one file: `packages/client/src/pages/ChemicalSearchPage.tsx` (~1052 lines, inline sub-components). Expand modal: `components/MoleculeCard.tsx`. Data: `mocks/chemRegData.ts`.

1. **`CompoundCard` component (NEW)** — reusable rich card. Used in 3 places: Step 3 detail, structure expand-modal, (reference).
2. **Step 3 Compound Detail** — replace inline `CompoundDetailStep` with `CompoundCard`; support **N selected compounds → N stacked expanded cards**.
3. **Structure expand-modal** (`MoleculeCard.tsx`) — render full `CompoundCard` instead of bare structure; add **zoom** on structure (fixed-size today).
4. **Compound-name typeahead** (Step 1 `MoleculeInputStep`) — searchable dropdown over compound names → loads SMILES. Does not exist today.
5. **Back navigation** — explicit Back button per step (not breadcrumb-only).
6. **Ontology rename** — "Molecule" → "Compound" across breadcrumb/stepper labels + page title.
7. **Data enrichment (optional)** — add InChIKey, exact mass, aromatic-ring split, fraction Csp3, formal charge to `ChemRegCompound` + backfill 20 mocks (structure-derived values only).

## Build order
1. Data enrichment (item 7) + `CompoundCard` (item 1).
2. Wire into Step 3 single → multi-card (item 2).
3. Expand-modal + zoom (item 3).
4. Typeahead (item 4).
5. Back buttons + rename (items 5, 6) — mechanical, last.

## Out of scope
Tailwind adoption, TS-UI 0.5 upgrade, zustand, dashboard/workflow patterns, crystallization features, charts.
