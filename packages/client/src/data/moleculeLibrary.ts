// ============================================================
// 50 FDA-approved reference drugs with pre-computed UMAP coords
// ============================================================

export interface LibraryMolecule {
  id: string;
  name: string;
  smiles: string;
  umap_x: number;
  umap_y: number;
  mw: number;
  logp: number;
  hbd: number;
  hba: number;
}

export const MOLECULE_LIBRARY: LibraryMolecule[] = [
  // ── Kinase Inhibitors ──────────────────────────────────────
  { id: 'LIB-001', name: 'Imatinib',      smiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5', umap_x: 3.2, umap_y: 1.8, mw: 493.6, logp: 3.5, hbd: 2, hba: 7 },
  { id: 'LIB-002', name: 'Gefitinib',     smiles: 'COC1=C(C=C2C(=C1)C(=NC=N2)NC3=CC(=C(C=C3)F)Cl)OCCCN4CCOCC4', umap_x: 2.8, umap_y: 2.1, mw: 446.9, logp: 3.2, hbd: 1, hba: 7 },
  { id: 'LIB-003', name: 'Erlotinib',     smiles: 'COCCOC1=C(C=C2C(=C1)C(=NC=N2)NC3=CC=CC(=C3)C#C)OCCOC', umap_x: 3.0, umap_y: 2.4, mw: 393.4, logp: 2.7, hbd: 1, hba: 6 },
  { id: 'LIB-004', name: 'Sorafenib',     smiles: 'CNC(=O)C1=CC(=C(C=C1)OC2=CC=C(C=C2)NC(=O)NC3=CC(=C(C=C3)Cl)C(F)(F)F)C', umap_x: 3.5, umap_y: 1.5, mw: 464.8, logp: 3.8, hbd: 3, hba: 4 },
  { id: 'LIB-005', name: 'Sunitinib',     smiles: 'CCN(CC)CCNC(=O)C1=C(C(=C(S1)/C=C/2\\C(=O)NC3=CC=C(C=C23)F)C)C', umap_x: 3.3, umap_y: 2.6, mw: 398.5, logp: 2.9, hbd: 2, hba: 4 },
  { id: 'LIB-006', name: 'Dasatinib',     smiles: 'CC1=NC(=CC(=N1)NC2=CC(=C(C=C2)C(=O)NC3=C(C=CC=C3Cl)C)OC)N4CCN(CC4)CCO', umap_x: 2.9, umap_y: 1.3, mw: 488.0, logp: 2.8, hbd: 3, hba: 9 },
  { id: 'LIB-007', name: 'Lapatinib',     smiles: 'CS(=O)(=O)CCNCC1=CC=C(O1)C2=CC3=C(C=C2)N=CN=C3NC4=CC(=C(C=C4)Cl)OCC5=CC(=CC=C5)F', umap_x: 3.7, umap_y: 2.0, mw: 581.1, logp: 4.6, hbd: 2, hba: 8 },

  // ── CNS / GPCR ────────────────────────────────────────────
  { id: 'LIB-008', name: 'Fluoxetine',    smiles: 'CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F', umap_x: -2.1, umap_y: 3.5, mw: 309.3, logp: 4.1, hbd: 1, hba: 2 },
  { id: 'LIB-009', name: 'Sertraline',    smiles: 'CNC1CCC(C2=CC=CC=C12)C3=CC(=C(C=C3)Cl)Cl', umap_x: -2.4, umap_y: 3.2, mw: 306.2, logp: 5.1, hbd: 1, hba: 1 },
  { id: 'LIB-010', name: 'Olanzapine',    smiles: 'CC1=CC2=C(S1)NC3=CC(=CC=C3N2CC4=CN=CN4C)C', umap_x: -1.8, umap_y: 2.8, mw: 312.4, logp: 2.8, hbd: 1, hba: 4 },
  { id: 'LIB-011', name: 'Risperidone',   smiles: 'CC1=C(C(=O)N2CCCCC2=N1)CCN3CCC(CC3)C4=NOC5=C4C=CC(=C5)F', umap_x: -1.5, umap_y: 3.0, mw: 410.5, logp: 3.0, hbd: 0, hba: 6 },
  { id: 'LIB-012', name: 'Aripiprazole',  smiles: 'C1CCC(CC1)N2CCN(CC2)CCCCOC3=CC4=C(C=C3Cl)C(=O)NCC4', umap_x: -1.2, umap_y: 2.5, mw: 448.4, logp: 4.9, hbd: 1, hba: 4 },
  { id: 'LIB-013', name: 'Quetiapine',    smiles: 'OCCOCCN1CCN(CC1)C2=NC3=CC=CC=C3SC4=CC=CC=C24', umap_x: -2.0, umap_y: 2.2, mw: 383.5, logp: 2.8, hbd: 1, hba: 5 },

  // ── Cardiovascular ─────────────────────────────────────────
  { id: 'LIB-014', name: 'Atorvastatin',  smiles: 'CC(C)C1=C(C(=C(N1CCC(CC(CC(=O)O)O)O)C2=CC=C(C=C2)F)C3=CC=CC=C3)C(=O)NC4=CC=CC=C4', umap_x: 0.5, umap_y: -2.3, mw: 558.6, logp: 4.1, hbd: 4, hba: 5 },
  { id: 'LIB-015', name: 'Simvastatin',   smiles: 'CCC(C)(C)C(=O)OC1CC(C=C2C1C(C(C=C2)C)CCC3CC(CC(=O)O3)O)C', umap_x: 0.8, umap_y: -2.0, mw: 418.6, logp: 4.7, hbd: 1, hba: 5 },
  { id: 'LIB-016', name: 'Amlodipine',    smiles: 'CCOC(=O)C1=C(NC(=C(C1C2=CC=CC=C2Cl)C(=O)OC)C)COCCN', umap_x: 0.3, umap_y: -1.7, mw: 408.9, logp: 3.0, hbd: 2, hba: 6 },
  { id: 'LIB-017', name: 'Losartan',      smiles: 'CCCCC1=NC(=C(N1CC2=CC=C(C=C2)C3=CC=CC=C3C4=NN=NN4)CO)Cl', umap_x: 0.1, umap_y: -2.6, mw: 422.9, logp: 4.0, hbd: 2, hba: 5 },
  { id: 'LIB-018', name: 'Lisinopril',    smiles: 'C(CC(C(=O)O)NC(CCCCN)C(=O)O)CC1=CC=CC=C1', umap_x: -0.2, umap_y: -1.4, mw: 405.5, logp: -0.8, hbd: 4, hba: 6 },
  { id: 'LIB-019', name: 'Metoprolol',    smiles: 'CC(C)NCC(COC1=CC=C(C=C1)CCOC)O', umap_x: -0.5, umap_y: -2.1, mw: 267.4, logp: 1.9, hbd: 2, hba: 4 },

  // ── Anti-inflammatory ──────────────────────────────────────
  { id: 'LIB-020', name: 'Aspirin',       smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O', umap_x: -3.5, umap_y: -1.0, mw: 180.2, logp: 1.2, hbd: 1, hba: 4 },
  { id: 'LIB-021', name: 'Ibuprofen',     smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', umap_x: -3.8, umap_y: -0.7, mw: 206.3, logp: 3.5, hbd: 1, hba: 2 },
  { id: 'LIB-022', name: 'Naproxen',      smiles: 'CC(C1=CC2=C(C=C1)C=C(C=C2)OC)C(=O)O', umap_x: -3.2, umap_y: -0.4, mw: 230.3, logp: 3.2, hbd: 1, hba: 3 },
  { id: 'LIB-023', name: 'Celecoxib',     smiles: 'CC1=CC=C(C=C1)C2=CC(=NN2C3=CC=C(C=C3)S(=O)(=O)N)C(F)(F)F', umap_x: -2.8, umap_y: -0.1, mw: 381.4, logp: 3.5, hbd: 1, hba: 4 },
  { id: 'LIB-024', name: 'Diclofenac',    smiles: 'OC(=O)CC1=CC=CC=C1NC2=C(Cl)C=CC=C2Cl', umap_x: -3.0, umap_y: -1.3, mw: 296.1, logp: 4.5, hbd: 2, hba: 3 },

  // ── Antibiotics ────────────────────────────────────────────
  { id: 'LIB-025', name: 'Amoxicillin',   smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C', umap_x: 1.5, umap_y: 3.5, mw: 365.4, logp: 0.9, hbd: 4, hba: 7 },
  { id: 'LIB-026', name: 'Ciprofloxacin', smiles: 'C1CC1N2C=C(C(=O)C3=CC(=C(C=C32)N4CCNCC4)F)C(=O)O', umap_x: 1.8, umap_y: 3.8, mw: 331.3, logp: -1.1, hbd: 2, hba: 6 },
  { id: 'LIB-027', name: 'Doxycycline',   smiles: 'CC1C2C(C3C(C(=O)C(=C(C3(C(=O)C2=C(C4=C1C=CC=C4O)O)O)O)C(=O)N)N(C)C)O', umap_x: 2.1, umap_y: 3.2, mw: 444.4, logp: -0.2, hbd: 6, hba: 9 },
  { id: 'LIB-028', name: 'Azithromycin',  smiles: 'CCC1C(C(C(N(CC(CC(C(C(C(C(=O)O1)C)OC2CC(C(C(O2)C)O)(C)OC)C)OC3CC(C(C(O3)C)NC(C)C)(C)O)C)C)C)O)(C)O', umap_x: 2.5, umap_y: 4.0, mw: 748.9, logp: 4.0, hbd: 5, hba: 14 },

  // ── Antivirals ─────────────────────────────────────────────
  { id: 'LIB-029', name: 'Oseltamivir',   smiles: 'CCOC(=O)C1=CC(OC(CC)CC)C(NC(C)=O)C(N)C1', umap_x: -0.5, umap_y: 4.5, mw: 312.4, logp: 1.0, hbd: 2, hba: 5 },
  { id: 'LIB-030', name: 'Acyclovir',     smiles: 'C1=NC2=C(N1COCCO)NC(=NC2=O)N', umap_x: -0.8, umap_y: 4.8, mw: 225.2, logp: -1.6, hbd: 3, hba: 6 },
  { id: 'LIB-031', name: 'Ritonavir',     smiles: 'CC(C)C(NC(=O)OCC1=CN=CS1)C(=O)NC(CC(O)C(NC(=O)C(NC(=O)OCC2=CN=CS2)CC3=CC=CC=C3)CC4=CC=CC=C4)CC5=CC=CC=C5', umap_x: -0.2, umap_y: 4.2, mw: 720.9, logp: 5.9, hbd: 4, hba: 9 },
  { id: 'LIB-032', name: 'Remdesivir',    smiles: 'CCC(CC)COC(=O)C(C)NP(=O)(OCC1C(C(C(O1)C2=CC=C3N2N=CN=C3N)O)O)OC4=CC=CC=C4', umap_x: 0.2, umap_y: 5.0, mw: 602.6, logp: 1.9, hbd: 3, hba: 12 },

  // ── Oncology ───────────────────────────────────────────────
  { id: 'LIB-033', name: 'Tamoxifen',     smiles: 'CCC(=C(C1=CC=CC=C1)C2=CC=C(C=C2)OCCN(C)C)C3=CC=CC=C3', umap_x: 4.0, umap_y: -0.5, mw: 371.5, logp: 6.3, hbd: 0, hba: 2 },
  { id: 'LIB-034', name: 'Bicalutamide',  smiles: 'CC(CS(=O)(=O)C1=CC=C(C=C1)F)(C(=O)NC2=CC(=C(C=C2)C#N)C(F)(F)F)O', umap_x: 4.3, umap_y: -0.2, mw: 430.4, logp: 2.4, hbd: 2, hba: 6 },
  { id: 'LIB-035', name: 'Letrozole',     smiles: 'C1=CC=C(C=C1)C(C2=CC=C(C=C2)C#N)(N3C=NC=N3)C#N', umap_x: 4.1, umap_y: 0.3, mw: 285.3, logp: 2.5, hbd: 0, hba: 4 },
  { id: 'LIB-036', name: 'Temozolomide',  smiles: 'CN1C(=O)C2=C(N=CN2C1=O)N3C=NN=N3', umap_x: 3.8, umap_y: 0.0, mw: 194.2, logp: -0.5, hbd: 0, hba: 5 },
  { id: 'LIB-037', name: 'Olaparib',      smiles: 'C1CC1C(=O)N2CCN(CC2)C(=O)C3=CC=C(C=C3)CC4=NNC(=O)C5=CC=CC=C54', umap_x: 3.6, umap_y: -0.8, mw: 434.5, logp: 1.9, hbd: 1, hba: 6 },

  // ── Metabolic ──────────────────────────────────────────────
  { id: 'LIB-038', name: 'Metformin',     smiles: 'CN(C)C(=N)NC(=N)N', umap_x: -4.0, umap_y: 0.5, mw: 129.2, logp: -1.4, hbd: 3, hba: 4 },
  { id: 'LIB-039', name: 'Sitagliptin',   smiles: 'C1CN2C(=NN=C2C(F)(F)F)CN1C(=O)CC(CC3=CC(=C(C=C3F)F)F)N', umap_x: -3.6, umap_y: 0.8, mw: 407.3, logp: 1.0, hbd: 2, hba: 7 },
  { id: 'LIB-040', name: 'Empagliflozin', smiles: 'OCC1OC(C(O)C(O)C1O)C2=CC(=C(Cl)C=C2)CC3=CC=C(OC4=CC=CC=C4)C=C3', umap_x: -3.3, umap_y: 1.2, mw: 450.9, logp: 2.3, hbd: 4, hba: 6 },

  // ── Respiratory ────────────────────────────────────────────
  { id: 'LIB-041', name: 'Montelukast',   smiles: 'CC(C)(O)C1=CC=CC=C1CCC(SCC2(CC2)CC(=O)O)C3=CC=CC=C3/C=C/C4=CC=C(Cl)C=C4', umap_x: 1.0, umap_y: -3.5, mw: 586.2, logp: 7.5, hbd: 2, hba: 4 },
  { id: 'LIB-042', name: 'Loratadine',    smiles: 'CCOC(=O)N1CCC(=C2C3=CC(=CC=C3CCC4=CC=CN=C42)Cl)CC1', umap_x: 1.3, umap_y: -3.2, mw: 382.9, logp: 5.2, hbd: 0, hba: 3 },

  // ── Miscellaneous ──────────────────────────────────────────
  { id: 'LIB-043', name: 'Omeprazole',    smiles: 'CC1=CN=C(C(=C1OC)C)CS(=O)C2=NC3=CC=CC=C3N2', umap_x: -1.0, umap_y: -3.0, mw: 345.4, logp: 2.2, hbd: 1, hba: 5 },
  { id: 'LIB-044', name: 'Sildenafil',    smiles: 'CCCC1=NN(C2=C1NC(=NC2=O)C3=C(C=CC(=C3)S(=O)(=O)N4CCN(CC4)C)OCC)C', umap_x: -0.7, umap_y: -3.5, mw: 474.6, logp: 2.5, hbd: 1, hba: 8 },
  { id: 'LIB-045', name: 'Warfarin',      smiles: 'CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O', umap_x: -1.3, umap_y: -2.7, mw: 308.3, logp: 2.7, hbd: 1, hba: 4 },
  { id: 'LIB-046', name: 'Gabapentin',    smiles: 'NCC1(CCCCC1)CC(=O)O', umap_x: -4.2, umap_y: -0.5, mw: 171.2, logp: -1.1, hbd: 2, hba: 3 },
  { id: 'LIB-047', name: 'Pregabalin',    smiles: 'CC(CC1=CC=CC=C1)CC(CC(=O)O)N', umap_x: -4.5, umap_y: -0.2, mw: 159.2, logp: -0.3, hbd: 2, hba: 3 },
  { id: 'LIB-048', name: 'Duloxetine',    smiles: 'CNCC(C1=CC=CS1)OC2=CC=C3C=CC=CC3=C2', umap_x: -2.6, umap_y: 3.8, mw: 297.4, logp: 4.7, hbd: 1, hba: 3 },
  { id: 'LIB-049', name: 'Venlafaxine',   smiles: 'COC1=CC=C(C=C1)C(CN(C)C)C2(CCCCC2)O', umap_x: -2.3, umap_y: 4.2, mw: 277.4, logp: 3.2, hbd: 1, hba: 3 },
  { id: 'LIB-050', name: 'Clopidogrel',   smiles: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=CC=CS3CC2', umap_x: 0.0, umap_y: -0.5, mw: 321.8, logp: 3.8, hbd: 0, hba: 3 },
];

export const EXAMPLE_MOLECULES = [
  { name: 'Aspirin',      smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { name: 'Ibuprofen',    smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O' },
  { name: 'Imatinib',     smiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5' },
  { name: 'Gefitinib',    smiles: 'COC1=C(C=C2C(=C1)C(=NC=N2)NC3=CC(=C(C=C3)F)Cl)OCCCN4CCOCC4' },
  { name: 'Fluoxetine',   smiles: 'CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F' },
  { name: 'Sertraline',   smiles: 'CNC1CCC(C2=CC=CC=C12)C3=CC(=C(C=C3)Cl)Cl' },
  { name: 'Atorvastatin', smiles: 'CC(C)C1=C(C(=C(N1CCC(CC(CC(=O)O)O)O)C2=CC=C(C=C2)F)C3=CC=CC=C3)C(=O)NC4=CC=CC=C4' },
  { name: 'Metformin',    smiles: 'CN(C)C(=N)NC(=N)N' },
  { name: 'Oseltamivir',  smiles: 'CCOC(=O)C1=CC(OC(CC)CC)C(NC(C)=O)C(N)C1' },
  { name: 'Celecoxib',    smiles: 'CC1=CC=C(C=C1)C2=CC(=NN2C3=CC=C(C=C3)S(=O)(=O)N)C(F)(F)F' },
];
