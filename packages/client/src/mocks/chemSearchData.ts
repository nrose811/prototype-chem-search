// ============================================================
// Chem Search — Mock Data (DEL Hit Finder style)
// ============================================================

export interface ChemUser {
  id: string;
  firstName: string;
  email: string;
}

export interface ChemFileRecord {
  fileId: string;
  filePath: string;
  category: 'RAW' | 'IDS' | 'PROCESSED';
  sourceType: string;
  sourceName: string;
  createdAt: string;
  size: number;
  traceId: string;
}

export interface LineageFile extends ChemFileRecord {
  updatedAt?: string;
  integration?: { name: string; type: string };
  data?: Record<string, unknown>;
}

export interface FileLineageResponse {
  file: LineageFile;
  related: LineageFile[];
}

export interface FileInfoResponse {
  files: ChemFileRecord[];
  total: number;
}

export interface UserFilesResponse {
  files: ChemFileRecord[];
  total: number;
  user: { id: string; name: string };
}

// ---------------------------------------------------------------------------
// Current user
// ---------------------------------------------------------------------------
export const MOCK_USER: ChemUser = {
  id: 'usr-0042',
  firstName: 'Nathan',
  email: 'NRose@tetrascience.com',
};

// ---------------------------------------------------------------------------
// Trace IDs — each groups RAW → IDS → PROCESSED
// ---------------------------------------------------------------------------
const TRACE = {
  delScreen1: 'trace-del-screen-001',
  delScreen2: 'trace-del-screen-002',
  compoundLib: 'trace-compound-lib-001',
  htsPlate:   'trace-hts-plate-001',
  sarAnalysis: 'trace-sar-analysis-001',
  admetPanel: 'trace-admet-panel-001',
};

// ---------------------------------------------------------------------------
// File catalog — 24 files across 6 experiments
// ---------------------------------------------------------------------------
export const MOCK_FILES: ChemFileRecord[] = [
  // ── DEL Screen 1 ──────────────────────────────────────────
  {
    fileId: 'f-del1-raw',
    filePath: '/instruments/illumina-miseq/del-screen-triazine-2026-03-12.fastq.gz',
    category: 'RAW',
    sourceType: 'Instrument',
    sourceName: 'Illumina MiSeq',
    createdAt: '2026-03-12T08:14:22Z',
    size: 2_147_483_648,
    traceId: TRACE.delScreen1,
  },
  {
    fileId: 'f-del1-ids',
    filePath: '/ids/del-screen-triazine-2026-03-12.ids.json',
    category: 'IDS',
    sourceType: 'Pipeline',
    sourceName: 'DEL Decode Pipeline v2.1',
    createdAt: '2026-03-12T09:32:05Z',
    size: 524_288_000,
    traceId: TRACE.delScreen1,
  },
  {
    fileId: 'f-del1-proc',
    filePath: '/processed/del-hits-triazine-2026-03-12.parquet',
    category: 'PROCESSED',
    sourceType: 'Pipeline',
    sourceName: 'Hit Caller v3.0',
    createdAt: '2026-03-12T10:05:18Z',
    size: 48_576_000,
    traceId: TRACE.delScreen1,
  },

  // ── DEL Screen 2 ──────────────────────────────────────────
  {
    fileId: 'f-del2-raw',
    filePath: '/instruments/illumina-miseq/del-screen-macrocycle-2026-03-14.fastq.gz',
    category: 'RAW',
    sourceType: 'Instrument',
    sourceName: 'Illumina MiSeq',
    createdAt: '2026-03-14T07:45:11Z',
    size: 3_221_225_472,
    traceId: TRACE.delScreen2,
  },
  {
    fileId: 'f-del2-ids',
    filePath: '/ids/del-screen-macrocycle-2026-03-14.ids.json',
    category: 'IDS',
    sourceType: 'Pipeline',
    sourceName: 'DEL Decode Pipeline v2.1',
    createdAt: '2026-03-14T09:12:44Z',
    size: 612_000_000,
    traceId: TRACE.delScreen2,
  },
  {
    fileId: 'f-del2-proc',
    filePath: '/processed/del-hits-macrocycle-2026-03-14.parquet',
    category: 'PROCESSED',
    sourceType: 'Pipeline',
    sourceName: 'Hit Caller v3.0',
    createdAt: '2026-03-14T10:28:33Z',
    size: 52_428_800,
    traceId: TRACE.delScreen2,
  },

  // ── Compound Library ───────────────────────────────────────
  {
    fileId: 'f-lib-raw',
    filePath: '/registrations/compound-library-export-2026-03-10.sdf',
    category: 'RAW',
    sourceType: 'ELN',
    sourceName: 'Benchling',
    createdAt: '2026-03-10T14:20:00Z',
    size: 156_000_000,
    traceId: TRACE.compoundLib,
  },
  {
    fileId: 'f-lib-ids',
    filePath: '/ids/compound-library-2026-03-10.ids.json',
    category: 'IDS',
    sourceType: 'Pipeline',
    sourceName: 'Structure Standardizer v1.4',
    createdAt: '2026-03-10T15:02:30Z',
    size: 89_000_000,
    traceId: TRACE.compoundLib,
  },
  {
    fileId: 'f-lib-proc',
    filePath: '/processed/compound-library-descriptors-2026-03-10.parquet',
    category: 'PROCESSED',
    sourceType: 'Pipeline',
    sourceName: 'Descriptor Calculator v2.0',
    createdAt: '2026-03-10T15:45:12Z',
    size: 34_000_000,
    traceId: TRACE.compoundLib,
  },

  // ── HTS Plate ──────────────────────────────────────────────
  {
    fileId: 'f-hts-raw',
    filePath: '/instruments/envision/hts-plate-KIN-042-2026-03-18.csv',
    category: 'RAW',
    sourceType: 'Instrument',
    sourceName: 'PerkinElmer EnVision',
    createdAt: '2026-03-18T11:30:00Z',
    size: 4_500_000,
    traceId: TRACE.htsPlate,
  },
  {
    fileId: 'f-hts-ids',
    filePath: '/ids/hts-plate-KIN-042-2026-03-18.ids.json',
    category: 'IDS',
    sourceType: 'Pipeline',
    sourceName: 'Plate Reader Parser v1.2',
    createdAt: '2026-03-18T11:45:22Z',
    size: 2_100_000,
    traceId: TRACE.htsPlate,
  },
  {
    fileId: 'f-hts-proc',
    filePath: '/processed/hts-dose-response-KIN-042-2026-03-18.parquet',
    category: 'PROCESSED',
    sourceType: 'Pipeline',
    sourceName: 'Dose-Response Fitter v2.3',
    createdAt: '2026-03-18T12:10:05Z',
    size: 1_200_000,
    traceId: TRACE.htsPlate,
  },

  // ── SAR Analysis ───────────────────────────────────────────
  {
    fileId: 'f-sar-raw',
    filePath: '/notebooks/sar-kinase-series-2026-03-20.ipynb',
    category: 'RAW',
    sourceType: 'ELN',
    sourceName: 'Benchling',
    createdAt: '2026-03-20T09:00:00Z',
    size: 8_400_000,
    traceId: TRACE.sarAnalysis,
  },
  {
    fileId: 'f-sar-ids',
    filePath: '/ids/sar-kinase-series-2026-03-20.ids.json',
    category: 'IDS',
    sourceType: 'Pipeline',
    sourceName: 'SAR Aggregator v1.0',
    createdAt: '2026-03-20T10:15:00Z',
    size: 3_200_000,
    traceId: TRACE.sarAnalysis,
  },
  {
    fileId: 'f-sar-proc',
    filePath: '/processed/sar-kinase-model-2026-03-20.parquet',
    category: 'PROCESSED',
    sourceType: 'Pipeline',
    sourceName: 'QSAR Model v4.1',
    createdAt: '2026-03-20T11:30:00Z',
    size: 1_800_000,
    traceId: TRACE.sarAnalysis,
  },

  // ── ADMET Panel ────────────────────────────────────────────
  {
    fileId: 'f-admet-raw',
    filePath: '/instruments/aurora/admet-panel-CYP-2026-03-22.xlsx',
    category: 'RAW',
    sourceType: 'Instrument',
    sourceName: 'Aurora Discovery',
    createdAt: '2026-03-22T08:00:00Z',
    size: 12_500_000,
    traceId: TRACE.admetPanel,
  },
  {
    fileId: 'f-admet-ids',
    filePath: '/ids/admet-panel-CYP-2026-03-22.ids.json',
    category: 'IDS',
    sourceType: 'Pipeline',
    sourceName: 'ADMET Parser v1.1',
    createdAt: '2026-03-22T08:45:00Z',
    size: 5_600_000,
    traceId: TRACE.admetPanel,
  },
  {
    fileId: 'f-admet-proc',
    filePath: '/processed/admet-predictions-CYP-2026-03-22.parquet',
    category: 'PROCESSED',
    sourceType: 'Pipeline',
    sourceName: 'ADMET Predictor v3.2',
    createdAt: '2026-03-22T09:20:00Z',
    size: 2_400_000,
    traceId: TRACE.admetPanel,
  },

  // ── Extra standalone files (no full lineage) ───────────────
  {
    fileId: 'f-solo-sdf',
    filePath: '/uploads/vendor-compounds-2026-03-05.sdf',
    category: 'RAW',
    sourceType: 'Manual Upload',
    sourceName: 'ChemBridge',
    createdAt: '2026-03-05T16:00:00Z',
    size: 245_000_000,
    traceId: 'trace-solo-sdf',
  },
  {
    fileId: 'f-solo-nmr',
    filePath: '/instruments/bruker-avance/nmr-compound-TS-4217-2026-03-08.fid',
    category: 'RAW',
    sourceType: 'Instrument',
    sourceName: 'Bruker Avance 600',
    createdAt: '2026-03-08T13:22:00Z',
    size: 67_000_000,
    traceId: 'trace-solo-nmr',
  },
  {
    fileId: 'f-solo-lcms',
    filePath: '/instruments/waters-xevo/lcms-purity-check-2026-03-09.raw',
    category: 'RAW',
    sourceType: 'Instrument',
    sourceName: 'Waters Xevo G2-XS',
    createdAt: '2026-03-09T10:15:00Z',
    size: 128_000_000,
    traceId: 'trace-solo-lcms',
  },
  {
    fileId: 'f-solo-docking',
    filePath: '/processed/docking-scores-JAK2-2026-03-15.csv',
    category: 'PROCESSED',
    sourceType: 'Computation',
    sourceName: 'Glide SP v9.4',
    createdAt: '2026-03-15T17:30:00Z',
    size: 3_400_000,
    traceId: 'trace-solo-docking',
  },
];

// ---------------------------------------------------------------------------
// IDS payloads — rich JSON attached to IDS files
// ---------------------------------------------------------------------------
export const IDS_PAYLOADS: Record<string, Record<string, unknown>> = {
  'f-del1-ids': {
    '@idsNamespace': 'pharma',
    '@idsType': 'del-screening-result',
    '@idsVersion': '2.0.0',
    experiment_name: 'DEL Screen — Triazine Library vs BRD4',
    target_protein: 'BRD4 (Bromodomain 4)',
    library: {
      name: 'TS-DEL-Triazine-3.2M',
      size: 3_200_000,
      building_blocks: 3,
      scaffold: 'Triazine',
    },
    screening_conditions: {
      concentration_uM: 1.0,
      incubation_time_min: 60,
      temperature_C: 25,
      buffer: 'PBS pH 7.4 + 0.01% Tween-20',
    },
    hit_summary: {
      total_reads: 48_000_000,
      mapped_reads: 42_500_000,
      unique_compounds_detected: 2_850_000,
      enrichment_cutoff: 4.0,
      hits_above_cutoff: 342,
      hit_rate_pct: 0.012,
    },
    top_hits: [
      { compound_id: 'TS-DEL-T-001247', enrichment: 28.4, smiles: 'c1ccc(-c2nc(NC3CCCCC3)nc(NCc4ccccc4)n2)cc1' },
      { compound_id: 'TS-DEL-T-002891', enrichment: 22.1, smiles: 'c1ccc(-c2nc(NC3CCC(O)CC3)nc(NCc4ccncc4)n2)cc1' },
      { compound_id: 'TS-DEL-T-000534', enrichment: 19.7, smiles: 'c1ccc2c(c1)ccc1c2nc(NC2CCCCC2)nc1NCc1ccccc1F' },
    ],
  },
  'f-del2-ids': {
    '@idsNamespace': 'pharma',
    '@idsType': 'del-screening-result',
    '@idsVersion': '2.0.0',
    experiment_name: 'DEL Screen — Macrocycle Library vs KRAS G12C',
    target_protein: 'KRAS G12C',
    library: {
      name: 'TS-DEL-Macro-1.8M',
      size: 1_800_000,
      building_blocks: 4,
      scaffold: 'Macrocycle (14-16 membered)',
    },
    screening_conditions: {
      concentration_uM: 0.5,
      incubation_time_min: 120,
      temperature_C: 25,
      buffer: 'HEPES pH 7.5 + 1mM DTT',
    },
    hit_summary: {
      total_reads: 62_000_000,
      mapped_reads: 55_100_000,
      unique_compounds_detected: 1_640_000,
      enrichment_cutoff: 4.0,
      hits_above_cutoff: 187,
      hit_rate_pct: 0.011,
    },
    top_hits: [
      { compound_id: 'TS-DEL-M-004512', enrichment: 35.2, smiles: 'CC(C)C[C@@H]1NC(=O)[C@H](Cc2ccccc2)NC(=O)CNC(=O)[C@@H](CC(=O)O)NC1=O' },
      { compound_id: 'TS-DEL-M-003201', enrichment: 24.8, smiles: 'O=C1C[C@@H](NC(=O)[C@@H](Cc2c[nH]c3ccccc23)NC(=O)CN)CNC(=O)[C@H](CO)N1' },
    ],
  },
  'f-lib-ids': {
    '@idsNamespace': 'common',
    '@idsType': 'compound-registration',
    '@idsVersion': '1.2.0',
    library_name: 'Q1-2026 Compound Collection',
    registration_date: '2026-03-10',
    total_compounds: 12_450,
    sources: ['In-house synthesis', 'ChemBridge', 'Enamine'],
    property_summary: {
      mw_range: [150, 750],
      logP_range: [-1.2, 6.8],
      hbd_range: [0, 5],
      hba_range: [1, 12],
      ro5_compliant_pct: 78.2,
    },
  },
  'f-hts-ids': {
    '@idsNamespace': 'pharma',
    '@idsType': 'hts-plate-result',
    '@idsVersion': '1.0.0',
    plate_id: 'KIN-042',
    assay_name: 'Kinase Inhibition Assay — JAK2',
    target: 'JAK2 (Janus Kinase 2)',
    format: '384-well',
    read_type: 'Fluorescence Polarization',
    controls: {
      positive: { wells: ['A1', 'A2'], mean_signal: 45200, cv_pct: 3.2 },
      negative: { wells: ['P23', 'P24'], mean_signal: 2100, cv_pct: 4.1 },
      z_prime: 0.82,
    },
    results_summary: {
      total_compounds_tested: 352,
      hits_gt_50pct_inhibition: 28,
      hit_rate_pct: 7.95,
      ic50_range_nM: [12, 4500],
    },
  },
  'f-sar-ids': {
    '@idsNamespace': 'pharma',
    '@idsType': 'sar-analysis',
    '@idsVersion': '1.0.0',
    series_name: 'Aminopyrimidine Kinase Inhibitors',
    target: 'JAK2',
    total_analogs: 45,
    key_findings: [
      'Fluorine at R1 improves potency 3-fold (IC50: 45nM → 15nM)',
      'Cyclopropyl at R2 improves metabolic stability (t1/2: 12min → 48min)',
      'Methyl sulfonamide at R3 maintains solubility while improving selectivity',
    ],
    lead_compound: {
      id: 'TS-4217',
      ic50_nM: 8.2,
      selectivity_ratio_JAK1: 42,
      microsomal_stability_pct: 78,
      plasma_protein_binding_pct: 94.1,
    },
  },
  'f-admet-ids': {
    '@idsNamespace': 'pharma',
    '@idsType': 'admet-panel',
    '@idsVersion': '1.1.0',
    panel_name: 'CYP Inhibition Panel',
    compounds_tested: 8,
    assays: ['CYP1A2', 'CYP2C9', 'CYP2C19', 'CYP2D6', 'CYP3A4'],
    results: [
      { compound: 'TS-4217', CYP1A2: '>10', CYP2C9: '4.2', CYP2C19: '6.8', CYP2D6: '>10', CYP3A4: '2.1' },
      { compound: 'TS-4218', CYP1A2: '8.5', CYP2C9: '>10', CYP2C19: '>10', CYP2D6: '3.4', CYP3A4: '5.7' },
      { compound: 'TS-4219', CYP1A2: '>10', CYP2C9: '>10', CYP2C19: '>10', CYP2D6: '>10', CYP3A4: '>10' },
    ],
    flag: 'TS-4217 shows CYP3A4 liability (IC50 = 2.1 µM) — consider structural modification',
  },
};

// ---------------------------------------------------------------------------
// Helper: build LineageFile from ChemFileRecord
// ---------------------------------------------------------------------------
function toLineageFile(f: ChemFileRecord): LineageFile {
  return {
    ...f,
    updatedAt: f.createdAt,
    integration: f.sourceType === 'Pipeline'
      ? { name: f.sourceName, type: 'pipeline' }
      : undefined,
    data: IDS_PAYLOADS[f.fileId] ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Service functions (mock API layer)
// ---------------------------------------------------------------------------

export function getFileInfo(page = 1, pageSize = 10): FileInfoResponse {
  const start = (page - 1) * pageSize;
  const slice = MOCK_FILES.slice(start, start + pageSize);
  return { files: slice, total: MOCK_FILES.length };
}

export function getFileLineage(fileId: string): FileLineageResponse | null {
  const target = MOCK_FILES.find((f) => f.fileId === fileId);
  if (!target) return null;

  const related = MOCK_FILES
    .filter((f) => f.traceId === target.traceId && f.fileId !== fileId)
    .map(toLineageFile);

  return {
    file: toLineageFile(target),
    related,
  };
}

export function getUserRecentFiles(): UserFilesResponse {
  const rawFiles = MOCK_FILES
    .filter((f) => f.category === 'RAW')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    files: rawFiles,
    total: rawFiles.length,
    user: { id: MOCK_USER.id, name: MOCK_USER.firstName },
  };
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function categoryColor(cat: string): string {
  switch (cat) {
    case 'RAW': return '#e67e22';
    case 'IDS': return '#3498db';
    case 'PROCESSED': return '#27ae60';
    default: return '#95a5a6';
  }
}
