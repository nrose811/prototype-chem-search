// ============================================================
// Chemical Registration Database — Mock Data
// ============================================================

export interface ChemRegCompound {
  molId: string;
  name: string;
  smiles: string;
  formula: string;
  mw: number;
  casNumber: string;
  registrationDate: string;
  registeredBy: string;
  project: string;
  // Drug-likeness properties
  logP: number;
  tpsa: number;
  hba: number;
  hbd: number;
  rotatableBonds: number;
  ringCount: number;
  stereocenters: number;
}

export type SearchMode = 'similarity' | 'substructure' | 'exact' | 'formula';
export type SimilarityMetric = 'tanimoto' | 'dice';

export interface SearchOptions {
  mode: SearchMode;
  metric: SimilarityMetric;
  threshold: number;
  stereoSearch: boolean;
  tautomerSearch: boolean;
  chargeMatch: boolean;
}

export const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  mode: 'similarity',
  metric: 'tanimoto',
  threshold: 0.4,
  stereoSearch: false,
  tautomerSearch: true,
  chargeMatch: false,
};

export interface SearchResult {
  compound: ChemRegCompound;
  similarity: number;
  tanimotoScore: number;
  diceScore: number;
  matchType: 'exact' | 'substructure' | 'similarity' | 'formula';
}

export interface PlatformFile {
  fileId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  size: number;
  createdAt: string;
  source: string;
  molIds: string[];
}

// ---------------------------------------------------------------------------
// Lipinski Rule of 5
// ---------------------------------------------------------------------------
export interface LipinskiResult {
  pass: boolean;
  violations: number;
  details: { rule: string; value: number; limit: string; pass: boolean }[];
}

export function lipinskiRuleOfFive(c: ChemRegCompound): LipinskiResult {
  const rules = [
    { rule: 'MW ≤ 500', value: c.mw, limit: '≤ 500', pass: c.mw <= 500 },
    { rule: 'LogP ≤ 5', value: c.logP, limit: '≤ 5', pass: c.logP <= 5 },
    { rule: 'HBA ≤ 10', value: c.hba, limit: '≤ 10', pass: c.hba <= 10 },
    { rule: 'HBD ≤ 5', value: c.hbd, limit: '≤ 5', pass: c.hbd <= 5 },
  ];
  const violations = rules.filter((r) => !r.pass).length;
  return { pass: violations <= 1, violations, details: rules };
}

// ---------------------------------------------------------------------------
// 20 registered compounds (with drug-likeness properties)
// ---------------------------------------------------------------------------
export const CHEM_REG_COMPOUNDS: ChemRegCompound[] = [
  {
    molId: 'MOL-0001', name: 'Imatinib', formula: 'C29H31N7O', mw: 493.6, casNumber: '152459-95-5',
    smiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5',
    registrationDate: '2025-06-15', registeredBy: 'J. Chen', project: 'Kinase Program',
    logP: 3.5, tpsa: 86.3, hba: 7, hbd: 2, rotatableBonds: 7, ringCount: 6, stereocenters: 0,
  },
  {
    molId: 'MOL-0002', name: 'Gefitinib', formula: 'C22H24ClFN4O3', mw: 446.9, casNumber: '184475-35-2',
    smiles: 'COC1=C(C=C2C(=C1)C(=NC=N2)NC3=CC(=C(C=C3)F)Cl)OCCCN4CCOCC4',
    registrationDate: '2025-07-02', registeredBy: 'S. Patel', project: 'Kinase Program',
    logP: 3.2, tpsa: 68.7, hba: 7, hbd: 1, rotatableBonds: 8, ringCount: 4, stereocenters: 0,
  },
  {
    molId: 'MOL-0003', name: 'Aspirin', formula: 'C9H8O4', mw: 180.2, casNumber: '50-78-2',
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    registrationDate: '2025-01-10', registeredBy: 'M. Rodriguez', project: 'Reference Standards',
    logP: 1.2, tpsa: 63.6, hba: 4, hbd: 1, rotatableBonds: 3, ringCount: 1, stereocenters: 0,
  },
  {
    molId: 'MOL-0004', name: 'Caffeine', formula: 'C8H10N4O2', mw: 194.2, casNumber: '58-08-2',
    smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
    registrationDate: '2025-01-10', registeredBy: 'M. Rodriguez', project: 'Reference Standards',
    logP: -0.1, tpsa: 58.4, hba: 6, hbd: 0, rotatableBonds: 0, ringCount: 2, stereocenters: 0,
  },
  {
    molId: 'MOL-0005', name: 'Acetaminophen', formula: 'C8H9NO2', mw: 151.2, casNumber: '103-90-2',
    smiles: 'CC(=O)NC1=CC=C(C=C1)O',
    registrationDate: '2025-01-10', registeredBy: 'M. Rodriguez', project: 'Reference Standards',
    logP: 0.5, tpsa: 49.3, hba: 2, hbd: 2, rotatableBonds: 1, ringCount: 1, stereocenters: 0,
  },
  {
    molId: 'MOL-0006', name: 'Atorvastatin', formula: 'C33H35FN2O5', mw: 558.6, casNumber: '134523-00-5',
    smiles: 'CC(C)C1=C(C(=C(N1CCC(CC(CC(=O)O)O)O)C2=CC=C(C=C2)F)C3=CC=CC=C3)C(=O)NC4=CC=CC=C4',
    registrationDate: '2025-03-20', registeredBy: 'J. Chen', project: 'Cardiovascular',
    logP: 4.5, tpsa: 111.8, hba: 5, hbd: 4, rotatableBonds: 12, ringCount: 4, stereocenters: 2,
  },
  {
    molId: 'MOL-0007', name: 'Celecoxib', formula: 'C17H14F3N3O2S', mw: 381.4, casNumber: '169590-42-5',
    smiles: 'CC1=CC=C(C=C1)C2=CC(=NN2C3=CC=C(C=C3)S(=O)(=O)N)C(F)(F)F',
    registrationDate: '2025-04-12', registeredBy: 'A. Kim', project: 'Anti-inflammatory',
    logP: 3.5, tpsa: 77.9, hba: 4, hbd: 1, rotatableBonds: 3, ringCount: 3, stereocenters: 0,
  },
  {
    molId: 'MOL-0008', name: 'Fluoxetine', formula: 'C17H18F3NO', mw: 309.3, casNumber: '54910-89-3',
    smiles: 'CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F',
    registrationDate: '2025-05-01', registeredBy: 'S. Patel', project: 'CNS Program',
    logP: 4.1, tpsa: 21.3, hba: 2, hbd: 1, rotatableBonds: 6, ringCount: 2, stereocenters: 1,
  },
  {
    molId: 'MOL-0009', name: 'Metformin', formula: 'C4H11N5', mw: 129.2, casNumber: '657-24-9',
    smiles: 'CN(C)C(=N)NC(=N)N',
    registrationDate: '2025-02-18', registeredBy: 'M. Rodriguez', project: 'Metabolic',
    logP: -1.4, tpsa: 91.5, hba: 5, hbd: 3, rotatableBonds: 2, ringCount: 0, stereocenters: 0,
  },
  {
    molId: 'MOL-0010', name: 'Oseltamivir', formula: 'C16H28N2O4', mw: 312.4, casNumber: '196618-13-0',
    smiles: 'CCOC(=O)C1=CC(OC(CC)CC)C(NC(C)=O)C(N)C1',
    registrationDate: '2025-02-25', registeredBy: 'A. Kim', project: 'Antiviral',
    logP: 1.0, tpsa: 90.7, hba: 5, hbd: 3, rotatableBonds: 7, ringCount: 1, stereocenters: 3,
  },
  // ── Fictional TetraScience compounds ───────────────────────
  {
    molId: 'MOL-0011', name: 'TS-4217', formula: 'C24H23FN6O2S', mw: 478.5, casNumber: 'N/A',
    smiles: 'CC1=NC(=CC(=N1)NC2=CC(=C(C=C2)C(=O)NC3=C(C=CC=C3F)S(=O)(=O)C)OC)N4CCNCC4',
    registrationDate: '2026-01-15', registeredBy: 'N. Rose', project: 'JAK2 Lead Optimization',
    logP: 2.8, tpsa: 109.4, hba: 8, hbd: 3, rotatableBonds: 6, ringCount: 5, stereocenters: 0,
  },
  {
    molId: 'MOL-0012', name: 'TS-4218', formula: 'C23H21ClFN5O2', mw: 453.9, casNumber: 'N/A',
    smiles: 'CC1=NC(=CC(=N1)NC2=CC(=C(C=C2)Cl)F)NC(=O)C3=CC=C(C=C3)N4CCN(CC4)C(=O)C',
    registrationDate: '2026-01-22', registeredBy: 'N. Rose', project: 'JAK2 Lead Optimization',
    logP: 3.1, tpsa: 87.6, hba: 6, hbd: 2, rotatableBonds: 5, ringCount: 5, stereocenters: 0,
  },
  {
    molId: 'MOL-0013', name: 'TS-4219', formula: 'C22H24N6O3', mw: 420.5, casNumber: 'N/A',
    smiles: 'COC1=CC(=CC(=C1OC)OC)C(=O)NC2=CC=C(C=C2)NC3=NC=CC(=N3)N4CCNCC4',
    registrationDate: '2026-02-03', registeredBy: 'N. Rose', project: 'JAK2 Lead Optimization',
    logP: 1.9, tpsa: 102.3, hba: 8, hbd: 3, rotatableBonds: 7, ringCount: 5, stereocenters: 0,
  },
  {
    molId: 'MOL-0014', name: 'TS-4220', formula: 'C21H20F2N4O2S', mw: 430.5, casNumber: 'N/A',
    smiles: 'CC1=NC(=CC(=N1)NC2=CC(=C(C=C2)S(=O)(=O)C)F)NC3=CC=C(C=C3)F',
    registrationDate: '2026-02-10', registeredBy: 'J. Chen', project: 'JAK2 Lead Optimization',
    logP: 3.4, tpsa: 82.1, hba: 5, hbd: 2, rotatableBonds: 4, ringCount: 4, stereocenters: 0,
  },
  {
    molId: 'MOL-0015', name: 'TS-5101', formula: 'C26H28N4O3', mw: 444.5, casNumber: 'N/A',
    smiles: 'COC1=CC=C(C=C1)C2=CC(=NN2C3=CC=CC=C3)CC(=O)NC4=CC=C(C=C4)N5CCOCC5',
    registrationDate: '2026-03-01', registeredBy: 'S. Patel', project: 'BRD4 Inhibitor',
    logP: 3.0, tpsa: 71.8, hba: 5, hbd: 1, rotatableBonds: 7, ringCount: 5, stereocenters: 0,
  },
  {
    molId: 'MOL-0016', name: 'TS-5102', formula: 'C25H27N5O2', mw: 429.5, casNumber: 'N/A',
    smiles: 'CC1=CC2=C(S1)NC3=CC(=CC=C3N2CC4=CN=CN4C)CC(=O)NC5=CC=CC=C5',
    registrationDate: '2026-03-08', registeredBy: 'S. Patel', project: 'BRD4 Inhibitor',
    logP: 2.6, tpsa: 82.4, hba: 5, hbd: 2, rotatableBonds: 5, ringCount: 5, stereocenters: 0,
  },
  {
    molId: 'MOL-0017', name: 'TS-6001', formula: 'C20H22N2O4', mw: 354.4, casNumber: 'N/A',
    smiles: 'COC1=C(C=C(C=C1)C(=O)NC2CCCCC2)OC(=O)C3=CC=C(C=C3)N(C)C',
    registrationDate: '2026-03-15', registeredBy: 'A. Kim', project: 'KRAS G12C',
    logP: 2.9, tpsa: 70.7, hba: 4, hbd: 1, rotatableBonds: 7, ringCount: 3, stereocenters: 0,
  },
  {
    molId: 'MOL-0018', name: 'TS-6002', formula: 'C22H26N4O3S', mw: 426.5, casNumber: 'N/A',
    smiles: 'CC(C)NC(=O)C1=CC=C(C=C1)OC2=CC(=CC=C2)NS(=O)(=O)C3=CN=C(N=C3)N',
    registrationDate: '2026-03-22', registeredBy: 'A. Kim', project: 'KRAS G12C',
    logP: 1.8, tpsa: 109.2, hba: 7, hbd: 3, rotatableBonds: 8, ringCount: 4, stereocenters: 0,
  },
  {
    molId: 'MOL-0019', name: 'Sorafenib', formula: 'C21H16ClF3N4O3', mw: 464.8, casNumber: '284461-73-0',
    smiles: 'CNC(=O)C1=CC(=C(C=C1)OC2=CC=C(C=C2)NC(=O)NC3=CC(=C(C=C3)Cl)C(F)(F)F)C',
    registrationDate: '2025-08-10', registeredBy: 'J. Chen', project: 'Kinase Program',
    logP: 3.8, tpsa: 92.4, hba: 4, hbd: 3, rotatableBonds: 6, ringCount: 3, stereocenters: 0,
  },
  {
    molId: 'MOL-0020', name: 'Erlotinib', formula: 'C22H23N3O4', mw: 393.4, casNumber: '183321-74-6',
    smiles: 'COCCOC1=C(C=C2C(=C1)C(=NC=N2)NC3=CC=CC(=C3)C#C)OCCOC',
    registrationDate: '2025-09-05', registeredBy: 'S. Patel', project: 'Kinase Program',
    logP: 3.3, tpsa: 74.7, hba: 7, hbd: 1, rotatableBonds: 10, ringCount: 3, stereocenters: 0,
  },
];

// ---------------------------------------------------------------------------
// Platform files (30 files linked via molIds)
// ---------------------------------------------------------------------------
export const PLATFORM_FILES: PlatformFile[] = [
  // ── Imatinib (MOL-0001) ────────────────────────────────────
  { fileId: 'pf-001', fileName: 'imatinib-lcms-purity.raw', filePath: '/instruments/waters-xevo/imatinib-lcms-purity.raw', fileType: 'LC-MS', size: 128_000_000, createdAt: '2025-07-01T09:15:00Z', source: 'Waters Xevo G2-XS', molIds: ['MOL-0001'] },
  { fileId: 'pf-002', fileName: 'imatinib-1h-nmr.fid', filePath: '/instruments/bruker-avance/imatinib-1h-nmr.fid', fileType: 'NMR', size: 45_000_000, createdAt: '2025-07-02T14:30:00Z', source: 'Bruker Avance 600', molIds: ['MOL-0001'] },
  { fileId: 'pf-003', fileName: 'imatinib-kinase-assay.csv', filePath: '/assays/kinase-panel/imatinib-kinase-assay.csv', fileType: 'Assay', size: 2_400_000, createdAt: '2025-07-10T11:00:00Z', source: 'EnVision Plate Reader', molIds: ['MOL-0001'] },
  { fileId: 'pf-004', fileName: 'imatinib-synthesis-nb.pdf', filePath: '/eln/benchling/imatinib-synthesis-nb.pdf', fileType: 'ELN', size: 8_200_000, createdAt: '2025-06-20T16:00:00Z', source: 'Benchling', molIds: ['MOL-0001'] },

  // ── Gefitinib (MOL-0002) ───────────────────────────────────
  { fileId: 'pf-005', fileName: 'gefitinib-lcms-characterization.raw', filePath: '/instruments/waters-xevo/gefitinib-lcms.raw', fileType: 'LC-MS', size: 96_000_000, createdAt: '2025-07-15T10:00:00Z', source: 'Waters Xevo G2-XS', molIds: ['MOL-0002'] },
  { fileId: 'pf-006', fileName: 'gefitinib-egfr-ic50.csv', filePath: '/assays/egfr/gefitinib-egfr-ic50.csv', fileType: 'Assay', size: 1_800_000, createdAt: '2025-07-20T09:00:00Z', source: 'EnVision Plate Reader', molIds: ['MOL-0002'] },

  // ── Aspirin (MOL-0003) ─────────────────────────────────────
  { fileId: 'pf-007', fileName: 'aspirin-ftir-spectrum.dx', filePath: '/instruments/perkinelmer/aspirin-ftir.dx', fileType: 'IR', size: 3_200_000, createdAt: '2025-02-10T13:00:00Z', source: 'PerkinElmer Spectrum Two', molIds: ['MOL-0003'] },
  { fileId: 'pf-008', fileName: 'aspirin-stability-30d.xlsx', filePath: '/stability/aspirin-stability-30d.xlsx', fileType: 'Stability', size: 4_500_000, createdAt: '2025-03-15T08:00:00Z', source: 'Stability Chamber', molIds: ['MOL-0003'] },

  // ── Celecoxib (MOL-0007) ───────────────────────────────────
  { fileId: 'pf-009', fileName: 'celecoxib-cox2-selectivity.csv', filePath: '/assays/cox/celecoxib-cox2.csv', fileType: 'Assay', size: 1_200_000, createdAt: '2025-05-01T10:30:00Z', source: 'EnVision Plate Reader', molIds: ['MOL-0007'] },
  { fileId: 'pf-010', fileName: 'celecoxib-plasma-stability.csv', filePath: '/admet/celecoxib-plasma-stability.csv', fileType: 'ADMET', size: 800_000, createdAt: '2025-05-10T14:00:00Z', source: 'Cyprotex', molIds: ['MOL-0007'] },

  // ── TS-4217 (MOL-0011) — lead compound, most data ─────────
  { fileId: 'pf-011', fileName: 'ts4217-jak2-biochem.csv', filePath: '/assays/jak2/ts4217-jak2-biochem.csv', fileType: 'Assay', size: 1_600_000, createdAt: '2026-01-20T11:00:00Z', source: 'EnVision Plate Reader', molIds: ['MOL-0011'] },
  { fileId: 'pf-012', fileName: 'ts4217-selectivity-panel.csv', filePath: '/assays/kinase-panel/ts4217-selectivity.csv', fileType: 'Assay', size: 3_400_000, createdAt: '2026-01-25T09:00:00Z', source: 'Eurofins DiscoverX', molIds: ['MOL-0011'] },
  { fileId: 'pf-013', fileName: 'ts4217-lcms-purity.raw', filePath: '/instruments/waters-xevo/ts4217-lcms.raw', fileType: 'LC-MS', size: 156_000_000, createdAt: '2026-01-18T14:30:00Z', source: 'Waters Xevo G2-XS', molIds: ['MOL-0011'] },
  { fileId: 'pf-014', fileName: 'ts4217-1h-nmr.fid', filePath: '/instruments/bruker-avance/ts4217-1h-nmr.fid', fileType: 'NMR', size: 52_000_000, createdAt: '2026-01-18T16:00:00Z', source: 'Bruker Avance 600', molIds: ['MOL-0011'] },
  { fileId: 'pf-015', fileName: 'ts4217-cyp-inhibition.csv', filePath: '/admet/ts4217-cyp-inhibition.csv', fileType: 'ADMET', size: 920_000, createdAt: '2026-02-05T10:00:00Z', source: 'Aurora Discovery', molIds: ['MOL-0011'] },
  { fileId: 'pf-016', fileName: 'ts4217-microsomal-stability.csv', filePath: '/admet/ts4217-microsomal-stability.csv', fileType: 'ADMET', size: 680_000, createdAt: '2026-02-08T11:30:00Z', source: 'Cyprotex', molIds: ['MOL-0011'] },
  { fileId: 'pf-017', fileName: 'ts4217-synthesis.pdf', filePath: '/eln/benchling/ts4217-synthesis.pdf', fileType: 'ELN', size: 12_400_000, createdAt: '2026-01-12T09:00:00Z', source: 'Benchling', molIds: ['MOL-0011'] },
  { fileId: 'pf-018', fileName: 'ts4217-xray-cocrystal.pdb', filePath: '/structures/ts4217-jak2-cocrystal.pdb', fileType: 'Structure', size: 2_800_000, createdAt: '2026-02-15T14:00:00Z', source: 'Diamond Light Source', molIds: ['MOL-0011'] },

  // ── TS-4218 (MOL-0012) ─────────────────────────────────────
  { fileId: 'pf-019', fileName: 'ts4218-jak2-biochem.csv', filePath: '/assays/jak2/ts4218-jak2-biochem.csv', fileType: 'Assay', size: 1_400_000, createdAt: '2026-01-28T11:00:00Z', source: 'EnVision Plate Reader', molIds: ['MOL-0012'] },
  { fileId: 'pf-020', fileName: 'ts4218-lcms-purity.raw', filePath: '/instruments/waters-xevo/ts4218-lcms.raw', fileType: 'LC-MS', size: 132_000_000, createdAt: '2026-01-24T15:00:00Z', source: 'Waters Xevo G2-XS', molIds: ['MOL-0012'] },

  // ── TS-4219 (MOL-0013) ─────────────────────────────────────
  { fileId: 'pf-021', fileName: 'ts4219-jak2-biochem.csv', filePath: '/assays/jak2/ts4219-jak2-biochem.csv', fileType: 'Assay', size: 1_500_000, createdAt: '2026-02-10T10:00:00Z', source: 'EnVision Plate Reader', molIds: ['MOL-0013'] },

  // ── TS-5101 (MOL-0015) ─────────────────────────────────────
  { fileId: 'pf-022', fileName: 'ts5101-brd4-alphascreen.csv', filePath: '/assays/brd4/ts5101-alphascreen.csv', fileType: 'Assay', size: 2_100_000, createdAt: '2026-03-05T09:30:00Z', source: 'EnVision Plate Reader', molIds: ['MOL-0015'] },
  { fileId: 'pf-023', fileName: 'ts5101-lcms-purity.raw', filePath: '/instruments/waters-xevo/ts5101-lcms.raw', fileType: 'LC-MS', size: 118_000_000, createdAt: '2026-03-03T14:00:00Z', source: 'Waters Xevo G2-XS', molIds: ['MOL-0015'] },
  { fileId: 'pf-024', fileName: 'ts5101-synthesis.pdf', filePath: '/eln/benchling/ts5101-synthesis.pdf', fileType: 'ELN', size: 9_800_000, createdAt: '2026-02-28T16:00:00Z', source: 'Benchling', molIds: ['MOL-0015'] },

  // ── TS-6001 (MOL-0017) ─────────────────────────────────────
  { fileId: 'pf-025', fileName: 'ts6001-kras-biochem.csv', filePath: '/assays/kras/ts6001-kras-biochem.csv', fileType: 'Assay', size: 1_300_000, createdAt: '2026-03-20T10:00:00Z', source: 'EnVision Plate Reader', molIds: ['MOL-0017'] },
  { fileId: 'pf-026', fileName: 'ts6001-cell-viability.csv', filePath: '/assays/cell/ts6001-cell-viability.csv', fileType: 'Assay', size: 2_600_000, createdAt: '2026-03-22T11:00:00Z', source: 'CellTiter-Glo', molIds: ['MOL-0017'] },

  // ── Sorafenib (MOL-0019) ───────────────────────────────────
  { fileId: 'pf-027', fileName: 'sorafenib-multikinase-panel.csv', filePath: '/assays/kinase-panel/sorafenib-multikinase.csv', fileType: 'Assay', size: 4_200_000, createdAt: '2025-08-20T09:00:00Z', source: 'Eurofins DiscoverX', molIds: ['MOL-0019'] },
  { fileId: 'pf-028', fileName: 'sorafenib-lcms.raw', filePath: '/instruments/waters-xevo/sorafenib-lcms.raw', fileType: 'LC-MS', size: 142_000_000, createdAt: '2025-08-15T14:00:00Z', source: 'Waters Xevo G2-XS', molIds: ['MOL-0019'] },

  // ── Cross-linked: shared files ─────────────────────────────
  { fileId: 'pf-029', fileName: 'jak2-series-sar-summary.xlsx', filePath: '/reports/jak2-sar-summary.xlsx', fileType: 'Report', size: 6_800_000, createdAt: '2026-02-20T16:00:00Z', source: 'Spotfire', molIds: ['MOL-0011', 'MOL-0012', 'MOL-0013', 'MOL-0014'] },
  { fileId: 'pf-030', fileName: 'kinase-program-quarterly-review.pptx', filePath: '/reports/kinase-quarterly-Q1-2026.pptx', fileType: 'Report', size: 24_000_000, createdAt: '2026-04-01T08:00:00Z', source: 'Manual Upload', molIds: ['MOL-0001', 'MOL-0002', 'MOL-0011', 'MOL-0019', 'MOL-0020'] },
];

// ---------------------------------------------------------------------------
// Search functions
// ---------------------------------------------------------------------------

function bigramSet(s: string): Set<string> {
  const set = new Set<string>();
  const norm = s.replace(/\s/g, '');
  for (let i = 0; i < norm.length - 1; i++) {
    set.add(norm.substring(i, i + 2));
  }
  return set;
}

function diceCoefficient(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const bg of a) {
    if (b.has(bg)) intersection++;
  }
  return (2 * intersection) / (a.size + b.size);
}

function tanimotoCoefficient(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const bg of a) {
    if (b.has(bg)) intersection++;
  }
  return intersection / (a.size + b.size - intersection);
}

/** Normalize SMILES for exact matching (strip whitespace, canonical-ish) */
function normalizeSmiles(s: string): string {
  return s.replace(/\s/g, '');
}

/** Parse formula into element counts, e.g. "C9H8O4" → {C:9, H:8, O:4} */
function parseFormula(f: string): Record<string, number> {
  const counts: Record<string, number> = {};
  const re = /([A-Z][a-z]?)(\d*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(f)) !== null) {
    if (!m[1]) continue;
    counts[m[1]] = (counts[m[1]] || 0) + (m[2] ? parseInt(m[2], 10) : 1);
  }
  return counts;
}

/** Match formula query against compound formula. Supports wildcards (*) per element. */
function formulaMatch(query: string, target: string): boolean {
  const q = query.trim().toUpperCase() === target.toUpperCase();
  if (q) return true;
  // Partial match: check if all query elements present in target
  const qCounts = parseFormula(query);
  const tCounts = parseFormula(target);
  for (const [el, count] of Object.entries(qCounts)) {
    if (!(el in tCounts)) return false;
    if (count !== tCounts[el]) return false;
  }
  return true;
}

export function searchCompounds(
  querySmiles: string,
  options: SearchOptions = DEFAULT_SEARCH_OPTIONS,
): SearchResult[] {
  const query = querySmiles.trim();
  if (!query) return [];

  // Formula search mode
  if (options.mode === 'formula') {
    return CHEM_REG_COMPOUNDS
      .filter((c) => formulaMatch(query, c.formula))
      .map((compound) => ({
        compound,
        similarity: 1.0,
        tanimotoScore: 0,
        diceScore: 0,
        matchType: 'formula' as const,
      }));
  }

  const queryNorm = normalizeSmiles(query);
  const queryBigrams = bigramSet(queryNorm);

  const results: SearchResult[] = CHEM_REG_COMPOUNDS.map((compound) => {
    const targetNorm = normalizeSmiles(compound.smiles);
    const targetBigrams = bigramSet(targetNorm);
    const dice = diceCoefficient(queryBigrams, targetBigrams);
    const tanimoto = tanimotoCoefficient(queryBigrams, targetBigrams);

    // Exact match
    if (options.mode === 'exact' || targetNorm === queryNorm) {
      if (targetNorm === queryNorm) {
        return { compound, similarity: 1.0, tanimotoScore: 1.0, diceScore: 1.0, matchType: 'exact' as const };
      }
      if (options.mode === 'exact') {
        return { compound, similarity: 0, tanimotoScore: 0, diceScore: 0, matchType: 'exact' as const };
      }
    }

    // Substructure
    if (options.mode === 'substructure') {
      const isSubstructure = targetNorm.includes(queryNorm) || queryNorm.includes(targetNorm);
      if (isSubstructure) {
        return { compound, similarity: 0.95, tanimotoScore: tanimoto, diceScore: dice, matchType: 'substructure' as const };
      }
    }

    // Similarity
    const primaryScore = options.metric === 'tanimoto' ? tanimoto : dice;
    return {
      compound,
      similarity: Math.round(primaryScore * 1000) / 1000,
      tanimotoScore: Math.round(tanimoto * 1000) / 1000,
      diceScore: Math.round(dice * 1000) / 1000,
      matchType: 'similarity' as const,
    };
  })
    .filter((r) => {
      if (options.mode === 'exact') return r.similarity === 1.0;
      return r.similarity >= options.threshold;
    })
    .sort((a, b) => b.similarity - a.similarity);

  return results;
}

export function getFilesForCompound(molId: string): PlatformFile[] {
  return PLATFORM_FILES.filter((f) => f.molIds.includes(molId));
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function fileTypeColor(type: string): string {
  switch (type) {
    case 'LC-MS': return '#e74c3c';
    case 'NMR': return '#9b59b6';
    case 'Assay': return '#2ecc71';
    case 'ELN': return '#3498db';
    case 'ADMET': return '#e67e22';
    case 'Stability': return '#1abc9c';
    case 'Structure': return '#8e44ad';
    case 'Report': return '#34495e';
    case 'IR': return '#d35400';
    default: return '#95a5a6';
  }
}
