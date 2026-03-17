# Benchling MCP Integration Plan

## Overview

Integrate the [Benchling MCP Server](https://github.com/tetrascience/ts-demo-benchling-mcp-server) with the TetraScience data visualization assistant so users can visualize life sciences data from Benchling through natural language prompts.

**Benchling MCP Server** provides 29+ tools across molecular biology, registry, inventory, analysis, notebooks, and instruments — all accessible via the Model Context Protocol (MCP).

---

## Current Progress

### ✅ Phase 1: MCP Client Integration (COMPLETE)

**What was built:**

| File | Description |
|------|-------------|
| `packages/client/src/services/BenchlingMCPClient.ts` | MCP client service with full tool wrappers |
| `packages/client/src/types/benchling.ts` | TypeScript types for all Benchling entities |
| `packages/client/src/services/benchlingMCPTest.ts` | Connection test script |
| `packages/client/src/services/README.md` | Setup & usage documentation |
| `packages/client/.env.example` | Environment variable template |
| `packages/client/.env.local` | Local credentials file (empty, needs values) |

**Dependencies installed:**
- `@modelcontextprotocol/sdk` (v1.27.1) — added to client package.json
- `benchling-mcp-server` (v0.1.0) — installed globally via `python -m pip install git+https://github.com/tetrascience/ts-demo-benchling-mcp-server.git`

**BenchlingMCPClient methods implemented:**
- `connect()` / `disconnect()` — lifecycle management
- `listDNASequences()` / `getDNASequence()` — molecular biology
- `listCustomEntities()` / `getCustomEntity()` — registry
- `listAssayResults()` / `getAssayResult()` — analysis
- `listContainers()` / `getContainer()` — inventory
- `listPlates()` / `getPlate()` — inventory
- `listBoxes()` / `getBox()` — inventory
- `listNotebookEntries()` / `getNotebookEntry()` — notebooks

**MCP server command:** Defaults to `python -m benchling_mcp_server.main` (configurable via `VITE_BENCHLING_MCP_COMMAND` env var).

### ✅ Benchling Credentials (CONFIGURED)

Credentials are configured in `packages/client/.env.local`:
- **Tenant:** `https://tetrasciencetest.benchling.com`
- **App ID:** `appdef_15IUbssWvwm`
- **Client ID:** `15IUbpaixcW`
- Authentication confirmed working (OAuth2 client credentials flow)

### ✅ Data Access — Partial

The app currently has access to:
- **1 project:** Scientific Data Workflow Automation (`src_2cvQry0g`)
  - 21 notebook entries
  - 50 containers
  - Assay results available
- **0 registries** — registry access not yet granted

### 🔲 TODO (Later): Complete Benchling Data Access

The app needs additional permissions configured in the Benchling tenant:
1. **Add registry access** — Go to Feature Settings → Registry → add the app as a collaborator
2. **Add more projects** (if needed) — Go to each project's settings → add the app
3. This is done in the Benchling UI, not in code. The Tenant Admin Console at `/admin/apps` may also be used.

> ⚠️ "Application access does not override project- or registry-level permissions" — each project/registry must be individually granted.

---

## Remaining Phases

### Phase 2: Data Adapter Layer

**Goal:** Transform raw Benchling data into visualization-ready formats for Plotly, RDKit, 3Dmol, etc.

**Tasks:**
1. Create `src/services/BenchlingDataAdapter.ts` with transformation methods:
   - `dnaSequencesToChart()` → bar chart of sequence lengths, base composition pie charts
   - `assayResultsToChart()` → scatter plots, grouped bar charts of assay data
   - `inventoryToChart()` → pie chart of container types, occupancy heatmaps
   - `entitiesToChart()` → table views, timeline charts of entity creation
   - `dnaSequenceTo3D()` → 3Dmol.js molecular structure data
2. Map each Benchling data type to appropriate visualization library:
   - DNA sequences → 3Dmol.js (3D structure) + Plotly (length distribution)
   - Assay results → Plotly (scatter, bar, line charts)
   - Custom entities → Plotly (tables, timelines) + RDKit (if chemical)
   - Inventory → Plotly (pie charts, heatmaps)
   - Notebook entries → Plotly (timeline, table)

### Phase 3: Prompt Detection & Routing

**Goal:** Detect Benchling-related prompts and route them to the correct data fetching + visualization flow.

**Tasks:**
1. Update `src/utils/chartDetection.ts` with Benchling keywords:
   - DNA/sequence keywords → `list_dna_sequences` → molecular viewer or length chart
   - Assay/results keywords → `list_assay_results` → scatter/bar charts
   - Inventory/container/plate keywords → inventory tools → pie/heatmap charts
   - Entity/registry keywords → `list_custom_entities` → table/timeline
   - Notebook/entry keywords → `list_entries` → timeline/table
2. Update `src/components/VisualizationRouter.tsx` to handle Benchling chart types
3. Add Benchling-specific entries to visualization type constants

**Example prompt → action mapping:**

| User Prompt | MCP Tool | Visualization |
|-------------|----------|---------------|
| "Show DNA sequence lengths" | `list_dna_sequences` | Bar chart (Plotly) |
| "Display a 3D view of sequence X" | `get_dna_sequence` | 3D structure (3Dmol) |
| "Show assay results from this month" | `list_assay_results` | Scatter plot (Plotly) |
| "Inventory summary" | `list_containers` + `list_plates` + `list_boxes` | Pie chart (Plotly) |
| "Show entities created this week" | `list_custom_entities` | Table + bar chart (Plotly) |
| "Notebook entries by author" | `list_entries` | Timeline (Plotly) |

### Phase 4: Environment & Security

**Goal:** Move credentials to a backend proxy so secrets aren't exposed in the browser.

**Tasks:**
1. Create a lightweight backend endpoint (or serverless function) that:
   - Receives visualization requests from the frontend
   - Spawns the MCP server process with credentials
   - Returns data to the frontend
2. Update `BenchlingMCPClient.ts` to call the backend proxy instead of spawning processes directly
3. Add proper error handling, retry logic, and connection status UI

> **Note:** The current `StdioClientTransport` approach spawns a child process, which works in Node.js/Electron but NOT in a browser environment. Phase 4 is required for production deployment.

### Phase 5: Advanced Features

**Goal:** Rich visualizations and deeper Benchling integration.

**Tasks:**
1. **Plate heatmaps** — Visualize plate well data as interactive heatmaps
2. **DNA annotation viewer** — Show annotations on DNA sequences using IGV.js
3. **Assay result comparisons** — Side-by-side comparison charts
4. **Dataset explorer** — Browse and visualize Benchling datasets (`list_datasets`, `get_dataset`)
5. **Mixture composition** — Pie/treemap charts for mixture components (`list_mixtures`, `get_mixture`)
6. **Assay run timelines** — Timeline of assay runs (`list_assay_runs`)
7. **Cross-entity dashboards** — Combine multiple data types in a single dashboard view

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   User (Browser)                         │
│                                                         │
│  "Show me DNA sequence lengths from Benchling"          │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│               chartDetection.ts                          │
│  Detects Benchling keywords → routes to Benchling flow   │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│            BenchlingDataAdapter.ts (Phase 2)              │
│  Calls BenchlingMCPClient → transforms data for charts   │
└───────────┬───────────────────────────┬─────────────────┘
            │                           │
            ▼                           ▼
┌───────────────────────┐   ┌───────────────────────────┐
│  BenchlingMCPClient   │   │   VisualizationRouter     │
│  (MCP SDK calls)      │   │   (renders chart/viewer)  │
└───────────┬───────────┘   └───────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────┐
│         Benchling MCP Server (Python process)          │
│         benchling-mcp-server via StdioTransport        │
│         Authenticated with OAuth2 credentials          │
└───────────┬───────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────┐
│              Benchling API (REST)                       │
│         https://your-tenant.benchling.com               │
└───────────────────────────────────────────────────────┘
```

---

## Key Technical Notes

- **Package manager:** Yarn 4.9.1
- **Node version:** >=20.0.0 <21.0.0
- **Python version:** 3.14.2 (installed on this machine)
- **MCP SDK:** `@modelcontextprotocol/sdk` v1.27.1
- **Benchling MCP Server:** Installed from `git+https://github.com/tetrascience/ts-demo-benchling-mcp-server.git`
- **Python Scripts path:** `C:\Users\nrose\AppData\Local\Python\pythoncore-3.14-64\Scripts` (not on PATH — use `python -m` instead)
- **Repository:** https://github.com/54321jenn/tetra-scientist
- **Branch:** `main` (or create a new feature branch for this work)
- **Benchling MCP Server repo:** https://github.com/tetrascience/ts-demo-benchling-mcp-server
- **Build system:** Vite (env vars must be prefixed with `VITE_`)
- **Existing viz libraries:** Plotly, 3Dmol.js, Mol*, IGV.js, RDKit.js

