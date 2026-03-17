import CustomTable, { TableColumn } from '../components/CustomTable';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import FilterCard, { FilterCardRef } from '../components/FilterCard';
import SearchAssistant from '../components/SearchAssistant';
import './SearchResultsPage.css';

interface SearchResult {
  id: string;
  name: string;
  sourceLocation: string;
  uploadedAt: string;
  uploadedAtRelative: string;
  fileType: 'document' | 'zip' | 'csv' | 'xlsx' | 'xls';
  content?: string;
}

const protocolContent = `# Proteomics Study 3 - Experimental Protocol
================================================================================
PROTEOMICS STUDY 3: COMPARATIVE PROTEIN EXPRESSION ANALYSIS
================================================================================

STUDY INFORMATION
-----------
Study ID: PS3-2026-001
Principal Investigator: Dr. Sarah Chen
Lab: Proteomics Research Center
Institution: TetraScience Molecular Biology Institute
Protocol Version: 2.1
Date Created: 01/05/2026
Last Modified: 01/09/2026
Status: Active

STUDY OBJECTIVE:
-----------
To perform comprehensive proteomic profiling of cancer cell lines treated with
experimental therapeutic compound TS-3847 compared to vehicle controls. This study
aims to identify differentially expressed proteins and elucidate the molecular
mechanisms of action for this novel anti-cancer agent. The proteomics data will
inform downstream pathway analysis and identify potential biomarkers for clinical
development.

SAMPLE INFORMATION:
-----------
Cell Line: A549 (human lung carcinoma)
Source: ATCC CCL-185
Passage Range: P15-P20
Culture Medium: RPMI-1640 + 10% FBS + 1% Pen/Strep
Sample Groups:
  - Group A: Vehicle Control (DMSO 0.1%) - 6 biological replicates
  - Group B: TS-3847 Treatment (10µM) - 6 biological replicates
Total Samples: 12

MATERIALS AND REAGENTS:
-----------
Reagents:
  - TS-3847 compound (10mM stock in DMSO)
  - DMSO (molecular biology grade)
  - RIPA lysis buffer
  - Protease inhibitor cocktail
  - Phosphatase inhibitor cocktail
  - BCA protein assay kit
  - DTT (dithiothreitol)
  - Iodoacetamide
  - Trypsin (sequencing grade)
  - TMT 6-plex labeling reagents
  - Acetonitrile (HPLC grade)
  - Formic acid (LC-MS grade)
  - Water (LC-MS grade)

Equipment:
  - Orbitrap Fusion Lumos mass spectrometer
  - EASY-nLC 1200 UHPLC system
  - C18 analytical column (75µm x 50cm, 2µm particles)
  - Centrifuge (refrigerated)
  - SpeedVac concentrator (Thermo Savant)
  - pH meter
  - Vortex mixer
  - -80°C freezer

EXPERIMENTAL PROCEDURE:
-----------

Day 1 - Cell Culture and Treatment:
1. Seed A549 cells at 2x10^6 cells per 10cm dish
2. Culture overnight in RPMI-1640 + 10% FBS at 37°C, 5% CO2
3. Verify cell confluency reaches 70-80%
4. Prepare treatment solutions:
   - Vehicle control: DMSO diluted to 0.1% in culture medium
   - TS-3847 treatment: 10µM final concentration in culture medium
5. Replace medium with treatment solutions (10mL per dish)
6. Incubate for 48 hours

Day 3 - Cell Harvest and Lysis:
1. Remove culture medium and wash cells 3x with ice-cold PBS
2. Add 500µL RIPA buffer + protease/phosphatase inhibitors per dish
3. Scrape cells and transfer to pre-chilled 1.5mL tubes
4. Incubate on ice for 30 minutes with vortexing every 10 min
5. Centrifuge at 14,000 x g for 15 min at 4°C
6. Transfer supernatant to fresh tubes, discard pellet
7. Measure protein concentration using BCA assay
8. Normalize all samples to 2 mg/mL
9. Aliquot 100µg protein per sample, store at -80°C

Day 4 - Protein Digestion:
1. Thaw protein samples on ice
2. Reduce disulfide bonds with 5mM DTT at 56°C for 30 min
3. Alkylate cysteines with 15mM iodoacetamide at RT for 30 min in dark
4. Quench with additional DTT to 10mM final concentration
5. Add trypsin at 1:50 enzyme:protein ratio
6. Digest overnight at 37°C with gentle shaking
7. Acidify with formic acid to pH 3
8. Desalt peptides using C18 spin columns
9. Dry peptides in SpeedVac

Day 5 - TMT Labeling:
1. Reconstitute peptides in 100mM TEAB buffer
2. Add TMT reagents according to manufacturer protocol
3. Incubate at RT for 1 hour
4. Quench reaction with hydroxylamine
5. Combine all labeled samples
6. Desalt combined sample
7. Dry and store at -80°C until LC-MS/MS analysis

Day 6-7 - LC-MS/MS Analysis:
1. Reconstitute peptides in 0.1% formic acid
2. Load 1µg peptides onto C18 analytical column
3. LC gradient (180 min):
   - 0-10 min: 3% B
   - 10-160 min: 3-40% B
   - 160-165 min: 40-80% B
   - 165-170 min: 80% B
   - 170-180 min: 3% B (re-equilibration)
   Mobile phase A: 0.1% formic acid in water
   Mobile phase B: 0.1% formic acid in 80% acetonitrile
4. MS parameters (Orbitrap Fusion Lumos):
   - MS1 scan: 120,000 resolution, 400-1600 m/z, AGC 4e5, 50ms max IT
   - MS2 scan: CID fragmentation, 35% collision energy
   - MS3 scan: HCD fragmentation for TMT quantification
   - Top speed mode with 3 second cycle time

DATA ANALYSIS:
-----------
1. Raw data processing with Proteome Discoverer 2.5
2. Database search against UniProt human proteome (reviewed entries)
3. Search parameters:
   - Enzyme: Trypsin, max 2 missed cleavages
   - Fixed modifications: Carbamidomethyl (C), TMT6plex (N-term, K)
   - Variable modifications: Oxidation (M), Acetyl (Protein N-term)
   - Precursor mass tolerance: 10 ppm
   - Fragment mass tolerance: 0.6 Da
   - FDR: 1% at peptide and protein level
4. Statistical analysis in Perseus software
5. Pathway enrichment analysis using DAVID and STRING

EXPECTED DELIVERABLES:
-----------
1. Raw MS data files (.raw format) - 12 files
2. Processed peptide identification files (.msf)
3. Protein quantification matrix (Excel)
4. Quality control report (PDF)
5. Differential expression analysis results
6. Pathway enrichment analysis results
7. Final study report with figures

DATA STORAGE:
-----------
Raw data: /tetrasphere/proteomics/study-3/samples/
Processed data: /tetrasphere/proteomics/study-3/processed/
Analysis results: /tetrasphere/proteomics/study-3/analysis/
Documentation: /tetrasphere/proteomics/study-3/docs/

TIMELINE:
-----------
Sample preparation: 01/06/2026 - 01/08/2026
MS data acquisition: 01/10/2026 - 01/12/2026
Data analysis: 01/13/2026 - 01/20/2026
Report generation: 01/21/2026 - 01/25/2026

NOTES:
-----------
- Maintain sterile technique throughout cell culture procedures
- Keep all samples on ice during processing
- Use fresh protease/phosphatase inhibitors
- Verify TMT labeling efficiency before combining samples
- Run quality control samples between batches
- Back up all raw data files immediately after acquisition

CONTACT INFORMATION:
-----------
Principal Investigator: Dr. Sarah Chen (schen@tetrascience.edu)
Lab Manager: Dr. Michael Rodriguez (mrodriguez@tetrascience.edu)
MS Facility: proteomics-facility@tetrascience.edu
Emergency Contact: +1-555-0123

================================================================================
END OF PROTOCOL
================================================================================`;

// Sample data for proteomics study 3
const searchResults: SearchResult[] = [
  {
    id: '1',
    name: 'Proteomics-Study3-Protocol.txt',
    sourceLocation: '/tetrasphere/proteomics/study-3/docs',
    uploadedAt: '01/09/2026 04:30:00 PM EST',
    uploadedAtRelative: 'Yesterday',
    fileType: 'document',
    content: protocolContent,
  },
  {
    id: '2',
    name: 'Proteomics-Study3-Sample-A1.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/samples',
    uploadedAt: '01/10/2026 08:15:33 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '3',
    name: 'Proteomics-Study3-Sample-A2.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/samples',
    uploadedAt: '01/10/2026 08:16:12 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '4',
    name: 'Proteomics-Study3-Sample-B1.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/samples',
    uploadedAt: '01/10/2026 08:17:45 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '5',
    name: 'Proteomics-Study3-Sample-B2.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/samples',
    uploadedAt: '01/10/2026 08:18:22 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '6',
    name: 'Proteomics-Study3-Control-C1.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/controls',
    uploadedAt: '01/10/2026 08:20:15 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '7',
    name: 'Proteomics-Study3-Control-C2.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/controls',
    uploadedAt: '01/10/2026 08:21:33 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '8',
    name: 'Proteomics-Study3-Metadata.csv',
    sourceLocation: '/tetrasphere/proteomics/study-3/metadata',
    uploadedAt: '01/10/2026 08:25:10 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'csv',
  },
  {
    id: '9',
    name: 'Pipeline-Executions-Report.xlsx',
    sourceLocation: '/tetrasphere/analytics/reports',
    uploadedAt: '02/11/2026 10:15:00 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'xlsx',
  },
];

// Sample data for chromatography
const chromatographyResults: SearchResult[] = [
  {
    id: 'c1',
    name: 'HPLC-Run-2026-001.raw',
    sourceLocation: '/tetrasphere/chromatography/hplc/runs',
    uploadedAt: '01/08/2026 09:15:00 AM EST',
    uploadedAtRelative: '2 days ago',
    fileType: 'document',
  },
  {
    id: 'c2',
    name: 'HPLC-Run-2026-002.raw',
    sourceLocation: '/tetrasphere/chromatography/hplc/runs',
    uploadedAt: '01/08/2026 10:30:22 AM EST',
    uploadedAtRelative: '2 days ago',
    fileType: 'document',
  },
  {
    id: 'c3',
    name: 'LC-MS-Analysis-Batch42.raw',
    sourceLocation: '/tetrasphere/chromatography/lc-ms/batch-42',
    uploadedAt: '01/09/2026 02:45:00 PM EST',
    uploadedAtRelative: 'Yesterday',
    fileType: 'document',
  },
  {
    id: 'c4',
    name: 'GC-Separation-Sample-A.raw',
    sourceLocation: '/tetrasphere/chromatography/gc/samples',
    uploadedAt: '01/09/2026 03:20:15 PM EST',
    uploadedAtRelative: 'Yesterday',
    fileType: 'document',
  },
  {
    id: 'c5',
    name: 'GC-Separation-Sample-B.raw',
    sourceLocation: '/tetrasphere/chromatography/gc/samples',
    uploadedAt: '01/09/2026 03:45:33 PM EST',
    uploadedAtRelative: 'Yesterday',
    fileType: 'document',
  },
  {
    id: 'c6',
    name: 'Chromatography-Method-Validation.pdf',
    sourceLocation: '/tetrasphere/chromatography/docs',
    uploadedAt: '01/10/2026 08:00:00 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: 'c7',
    name: 'HPLC-Calibration-Data.csv',
    sourceLocation: '/tetrasphere/chromatography/hplc/calibration',
    uploadedAt: '01/10/2026 09:30:00 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'csv',
  },
];

// File type icon components
const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ZipIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const CsvIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="8" y1="13" x2="16" y2="13"></line>
    <line x1="8" y1="17" x2="16" y2="17"></line>
  </svg>
);

const ExcelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#217346" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="8" y1="13" x2="16" y2="13"></line>
    <line x1="8" y1="17" x2="16" y2="17"></line>
    <line x1="12" y1="9" x2="12" y2="21"></line>
  </svg>
);

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'document':
      return <DocumentIcon />;
    case 'zip':
      return <ZipIcon />;
    case 'csv':
      return <CsvIcon />;
    case 'xlsx':
    case 'xls':
      return <ExcelIcon />;
    default:
      return <DocumentIcon />;
  }
};



// Additional icon components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    <path d="M5 3v4"></path>
    <path d="M19 17v4"></path>
    <path d="M3 5h4"></path>
    <path d="M17 19h4"></path>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const ColumnsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="4" x2="6" y2="20"></line>
    <line x1="12" y1="4" x2="12" y2="20"></line>
    <line x1="18" y1="4" x2="18" y2="20"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const DragIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="9" cy="5" r="1.5"></circle>
    <circle cx="9" cy="12" r="1.5"></circle>
    <circle cx="9" cy="19" r="1.5"></circle>
    <circle cx="15" cy="5" r="1.5"></circle>
    <circle cx="15" cy="12" r="1.5"></circle>
    <circle cx="15" cy="19" r="1.5"></circle>
  </svg>
);

const BookmarkIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const PreviewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const LineageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3"></circle>
    <circle cx="6" cy="6" r="3"></circle>
    <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
    <line x1="6" y1="9" x2="6" y2="21"></line>
  </svg>
);

const PlaceholderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

function SearchResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const columnsMenuRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFilterView, setShowFilterView] = useState(false);

  // Get initial assistant state from navigation
  const initialAssistantOpen = (location.state as { assistantOpen?: boolean })?.assistantOpen || false;
  const [showAssistant, setShowAssistant] = useState(initialAssistantOpen);

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [lastRemovedFilter, setLastRemovedFilter] = useState<string | null>(null);
  const filterCardRef = useRef<FilterCardRef>(null);

  // Get initial search type from navigation state
  const initialSearchType = (location.state as { searchType?: 'proteomics' | 'chromatography' })?.searchType || 'proteomics';
  const [currentSearchType, setCurrentSearchType] = useState<'proteomics' | 'chromatography'>(initialSearchType);
  const [searchQuery, setSearchQuery] = useState(
    initialSearchType === 'chromatography'
      ? 'All chromatography data for the last 2 weeks'
      : 'All data for proteomics study 3'
  );

  // Get current results based on search type
  const currentResults = currentSearchType === 'chromatography' ? chromatographyResults : searchResults;

  // Poll for active filters when assistant is open
  useEffect(() => {
    if (!showAssistant) return;

    const interval = setInterval(() => {
      const filters = filterCardRef.current?.getActiveFilters() || [];
      setActiveFilters(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(filters)) {
          return filters;
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showAssistant]);

  const handleAddFilter = (filterName: string) => {
    // Map display names to filter keys
    const filterMap: { [key: string]: string } = {
      'File name': 'fileName',
      'Created date': 'createdBetween',
      'Instrument': 'instrument',
      'Software': 'software',
      'Tags': 'tags',
      'File type': 'type',
    };
    const filterKey = filterMap[filterName] || filterName;
    filterCardRef.current?.addFilter(filterKey);
  };

  const handleSetFilterValue = (filterName: string, value: string) => {
    filterCardRef.current?.setFilterValue(filterName, value);
  };

  const handleFilterRemoved = (filterName: string) => {
    if (showAssistant) {
      setLastRemovedFilter(filterName);
    }
  };
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareItemName, setShareItemName] = useState('');
  const [toast, setToast] = useState<{message: string, visible: boolean, fadeOut: boolean}>({message: '', visible: false, fadeOut: false});
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    sourceLocation: true,
    uploadedAt: true,
  });
  const [columnOrder, setColumnOrder] = useState<string[]>(['name', 'sourceLocation', 'uploadedAt']);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [customColumns, setCustomColumns] = useState<{ [key: string]: { type: string; title: string } }>({});
  const [draggedModalColumn, setDraggedModalColumn] = useState<string | null>(null);
  const [selectedNewColumn, setSelectedNewColumn] = useState<string>('');
  const [columnTitles, setColumnTitles] = useState<{ [key: string]: string }>({
    name: 'Name',
    sourceLocation: 'Source Location',
    uploadedAt: 'Uploaded At',
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      const allIds = new Set(currentResults.map(r => r.id));
      setSelectedRows(allIds);
      setSelectAll(true);
    }
  };

  const handleRowSelect = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === currentResults.length);
  };

  const hasSelection = selectedRows.size > 0;

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleBookmark = (id: string, name: string) => {
    const newBookmarked = new Set(bookmarkedItems);
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id);
      setToast({message: `${name} removed from bookmarks`, visible: true, fadeOut: false});
    } else {
      newBookmarked.add(id);
      setToast({message: `${name} bookmarked`, visible: true, fadeOut: false});
    }
    setBookmarkedItems(newBookmarked);
  };

  const handleDownload = (name: string, content?: string) => {
    if (!content) {
      console.log('No content available for download');
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDragStart = (columnKey: string) => {
    setDraggedColumn(columnKey);
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== columnKey) {
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      const targetIndex = newOrder.indexOf(columnKey);

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumn);

      setColumnOrder(newOrder);
    }
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  // Available column types for adding new columns
  const baseColumnTypes = [
    { id: 'assay', label: 'Assay' },
    { id: 'batch', label: 'Batch' },
    { id: 'cellLine', label: 'Cell Line' },
    { id: 'dataType', label: 'Data Type' },
    { id: 'experiment', label: 'Experiment' },
    { id: 'fileFormat', label: 'File Format' },
    { id: 'instrument', label: 'Instrument' },
    { id: 'investigator', label: 'Investigator' },
    { id: 'notes', label: 'Notes' },
    { id: 'organism', label: 'Organism' },
    { id: 'project', label: 'Project' },
    { id: 'protocol', label: 'Protocol' },
    { id: 'replicate', label: 'Replicate' },
    { id: 'sample', label: 'Sample' },
    { id: 'status', label: 'Status' },
    { id: 'timepoint', label: 'Timepoint' },
    { id: 'tissue', label: 'Tissue' },
    { id: 'treatment', label: 'Treatment' },
  ];

  // Add default columns to the dropdown if they're not in columnOrder
  const availableColumnTypes = [
    ...baseColumnTypes,
    ...(!columnOrder.includes('name') ? [{ id: 'name', label: 'Name' }] : []),
    ...(!columnOrder.includes('sourceLocation') ? [{ id: 'sourceLocation', label: 'Source Location' }] : []),
    ...(!columnOrder.includes('uploadedAt') ? [{ id: 'uploadedAt', label: 'Uploaded At' }] : []),
  ].sort((a, b) => a.label.localeCompare(b.label));

  // Auto-hide toast with fade-out
  useEffect(() => {
    if (toast.visible && !toast.fadeOut) {
      // Start fade-out after 2.7 seconds
      const fadeTimer = setTimeout(() => {
        setToast(prev => ({...prev, fadeOut: true}));
      }, 2700);

      // Hide completely after fade-out animation (300ms)
      const hideTimer = setTimeout(() => {
        setToast({message: '', visible: false, fadeOut: false});
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [toast.visible, toast.fadeOut]);

  // Close columns menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target as Node)) {
        setColumnsMenuOpen(false);
      }
    };

    if (columnsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [columnsMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId && !(e.target as HTMLElement).closest('.action-menu-wrapper')) {
        setOpenMenuId(null);
      }
      if (bulkMenuOpen && !(e.target as HTMLElement).closest('.bulk-menu-wrapper')) {
        setBulkMenuOpen(false);
      }
      if (showInfo && !(e.target as HTMLElement).closest('.info-sidebar')) {
        // Check if the click is not on the About button that opens the sidebar
        if (!(e.target as HTMLElement).closest('[aria-label="About"]')) {
          setShowInfo(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId, bulkMenuOpen, showInfo]);

  const handleShare = (itemId: string, itemName: string) => {
    // Generate a shareable URL for the specific item
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/details/${itemId}`;

    setShareUrl(shareableUrl);
    setShareItemName(itemName);
    setShowShareModal(true);
    setOpenMenuId(null);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToast({message: 'Link copied to clipboard', visible: true, fadeOut: false});
      setShowShareModal(false);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setToast({message: 'Link copied to clipboard', visible: true, fadeOut: false});
      setShowShareModal(false);
    }
  };

  // Add checkbox column to data
  const dataWithCheckbox = currentResults.map(row => {
    const baseData = {
      ...row,
      checkbox: (
        <input
          type="checkbox"
          checked={selectedRows.has(row.id)}
          onChange={(e) => {
            e.stopPropagation();
            handleRowSelect(row.id);
          }}
          onClick={(e) => e.stopPropagation()}
          className="row-checkbox"
          aria-label={`Select ${row.name}`}
          title={`Select ${row.name}`}
        />
      ),
      nameWithIcon: (
        <div className="name-cell">
          <span className="file-icon">{getFileIcon(row.fileType)}</span>
          <span>{row.name}</span>
        </div>
      ),
      uploadedAtFormatted: (
        <div className="uploaded-cell">
          <div className="uploaded-date">{row.uploadedAt}</div>
          <div className="uploaded-relative">{row.uploadedAtRelative}</div>
        </div>
      ),
    actions: (
      <div className="actions-cell">
        <button
          className="action-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleBookmark(row.id, row.name);
          }}
          aria-label="Bookmark"
          data-tooltip="Bookmark"
        >
          <BookmarkIcon filled={bookmarkedItems.has(row.id)} />
        </button>
        <button
          className="action-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(row.name, row.content);
          }}
          aria-label="Download"
          data-tooltip="Download"
        >
          <DownloadIcon />
        </button>
        <button
          className="action-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowInfo(true);
          }}
          aria-label="About"
          data-tooltip="About"
        >
          <InfoIcon />
        </button>
        <div className="action-menu-wrapper">
          <button
            className="action-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === row.id ? null : row.id);
            }}
            aria-label="More actions"
            data-tooltip="More actions"
          >
            <MoreIcon />
          </button>
          {openMenuId === row.id && (
            <div className="action-menu">
              <button
                className="action-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(row.id, row.name);
                }}
              >
                <ShareIcon />
                <span>Share</span>
              </button>
              <button
                className="action-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Lineage', row.name);
                  setOpenMenuId(null);
                }}
              >
                <LineageIcon />
                <span>Lineage</span>
              </button>
            </div>
          )}
        </div>
      </div>
    ),
    };

    // Add custom column data with sample values
    const customData = Object.keys(customColumns).reduce((acc, key) => {
      const columnType = customColumns[key].type;

      // Generate sample data based on column type
      const sampleData: { [key: string]: string[] } = {
        experiment: ['EXP-2024-001', 'EXP-2024-002', 'EXP-2024-003', 'EXP-2024-004', 'EXP-2024-005'],
        protocol: ['Protocol A', 'Protocol B', 'Protocol C', 'Protocol A', 'Protocol B'],
        instrument: ['HPLC-MS-01', 'HPLC-MS-02', 'LC-MS-03', 'HPLC-MS-01', 'LC-MS-03'],
        sample: ['Sample-001', 'Sample-002', 'Sample-003', 'Sample-004', 'Sample-005'],
        assay: ['RNA-Seq', 'Proteomics', 'Metabolomics', 'RNA-Seq', 'Proteomics'],
        batch: ['Batch-A', 'Batch-B', 'Batch-A', 'Batch-C', 'Batch-B'],
        project: ['Cancer Research', 'Drug Discovery', 'Biomarker Study', 'Cancer Research', 'Drug Discovery'],
        investigator: ['Dr. Smith', 'Dr. Johnson', 'Dr. Chen', 'Dr. Smith', 'Dr. Johnson'],
        organism: ['Human', 'Mouse', 'Rat', 'Human', 'Mouse'],
        tissue: ['Liver', 'Brain', 'Heart', 'Kidney', 'Lung'],
        cellLine: ['HeLa', 'HEK293', 'CHO', 'HeLa', 'HEK293'],
        treatment: ['Control', 'Drug A', 'Drug B', 'Control', 'Drug A'],
        timepoint: ['0h', '24h', '48h', '72h', '0h'],
        replicate: ['Rep 1', 'Rep 2', 'Rep 3', 'Rep 1', 'Rep 2'],
        fileFormat: ['CSV', 'XLSX', 'RAW', 'CSV', 'XLSX'],
        dataType: ['Raw', 'Processed', 'Analyzed', 'Raw', 'Processed'],
        status: ['Complete', 'In Progress', 'Complete', 'Pending', 'Complete'],
        notes: ['QC passed', 'Rerun needed', 'Good quality', 'QC passed', 'Good quality'],
      };

      const values = sampleData[columnType] || ['—', '—', '—', '—', '—'];
      const rowIndex = currentResults.indexOf(row);
      acc[key] = values[rowIndex % values.length];

      return acc;
    }, {} as { [key: string]: any });

    return { ...baseData, ...customData };
  });

  // Define table columns based on visibility and order
  const baseColumnDefinitions: { [key: string]: TableColumn<typeof dataWithCheckbox[0]> } = {
    name: {
      key: 'nameWithIcon',
      header: columnTitles.name
    },
    sourceLocation: {
      key: 'sourceLocation',
      header: columnTitles.sourceLocation
    },
    uploadedAt: {
      key: 'uploadedAtFormatted',
      header: columnTitles.uploadedAt
    },
  };

  // Add custom columns to definitions
  const columnDefinitions: { [key: string]: TableColumn<typeof dataWithCheckbox[0]> } = {
    ...baseColumnDefinitions,
    ...Object.keys(customColumns).reduce((acc, key) => {
      acc[key] = {
        key: key,
        header: customColumns[key].title
      };
      return acc;
    }, {} as { [key: string]: TableColumn<typeof dataWithCheckbox[0]> })
  };

  const checkboxColumn: TableColumn<typeof dataWithCheckbox[0]> = {
    key: 'checkbox',
    header: (
      <input
        type="checkbox"
        checked={selectAll}
        onChange={handleSelectAll}
        className="row-checkbox"
        aria-label="Select all rows"
        title="Select all rows"
      />
    ),
    width: '50px'
  };

  const actionsColumn: TableColumn<typeof dataWithCheckbox[0]> = {
    key: 'actions',
    header: 'Actions',
    width: '120px'
  };

  // Build columns array based on order and visibility
  const orderedColumns = columnOrder
    .filter(key => {
      // Check if column exists in columnDefinitions
      if (!columnDefinitions[key]) return false;

      // Check visibility for default columns
      if (key === 'name') return visibleColumns.name;
      if (key === 'sourceLocation') return visibleColumns.sourceLocation;
      if (key === 'uploadedAt') return visibleColumns.uploadedAt;

      // Custom columns are always visible if they're in columnOrder
      return true;
    })
    .map(key => columnDefinitions[key]);

  const columns = [checkboxColumn, ...orderedColumns, actionsColumn];

  // Handle row click to navigate to details page
  const handleRowClick = (row: typeof dataWithCheckbox[0]) => {
    // Find the original data item (without the added UI properties)
    const originalData = currentResults.find(r => r.id === row.id);
    navigate(`/details/${row.id}`, { state: { data: originalData } });
  };

  return (
    <div className="search-results-page">
      <div className="search-bar-container">
        <div className="search-bar">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search your data..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className={`search-filter-btn ${showFilterView ? 'active' : ''}`}
            onClick={() => setShowFilterView(!showFilterView)}
            aria-label="Filter"
          >
            <FilterIcon />
            <span>Filters</span>
          </button>
          <button
            className={`search-ai-btn ${showAssistant ? 'active' : ''}`}
            onClick={() => setShowAssistant(!showAssistant)}
            aria-label="AI Assistant"
          >
            <SparklesIcon />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      <div className={`search-filter-view ${showFilterView ? 'visible' : ''} ${showAssistant ? 'assistant-open' : ''}`}>
        <FilterCard
          ref={filterCardRef}
          onClose={() => setShowFilterView(false)}
          onSearch={(searchType) => {
            setShowFilterView(false);
            if (searchType === 'chromatography') {
              setCurrentSearchType('chromatography');
              setSearchQuery('All chromatography data for the last 2 weeks');
            } else if (searchType === 'proteomics') {
              setCurrentSearchType('proteomics');
              setSearchQuery('All data for proteomics study 3');
            }
          }}
          onFilterRemoved={handleFilterRemoved}
        />
      </div>

      <div className="action-bar">
        <div className="action-bar-left">
          <button className="action-btn" disabled={!hasSelection} data-tooltip="Bookmark all">
            <BookmarkIcon />
            <span className="action-btn-text">Bookmark all</span>
          </button>
          <button className="action-btn" disabled={!hasSelection} data-tooltip="Share all">
            <ShareIcon />
            <span className="action-btn-text">Share all</span>
          </button>
          <button className="action-btn" disabled={!hasSelection} data-tooltip="Download all">
            <DownloadIcon />
            <span className="action-btn-text">Download all</span>
          </button>
          <div className="bulk-menu-wrapper">
            <button
              className="action-btn"
              disabled={!hasSelection}
              onClick={() => hasSelection && setBulkMenuOpen(!bulkMenuOpen)}
              data-tooltip="More"
            >
              <MoreIcon />
              <span className="action-btn-text">More</span>
            </button>
            {bulkMenuOpen && hasSelection && (
              <div className="bulk-action-menu">
                <button
                  className="action-menu-item"
                  onClick={() => {
                    console.log('Placeholder action');
                    setBulkMenuOpen(false);
                  }}
                >
                  <PlaceholderIcon />
                  <span>Placeholder</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="action-bar-right">
          <div className="columns-menu-wrapper" ref={columnsMenuRef}>
            <button
              className="action-btn"
              onClick={() => setColumnsMenuOpen(!columnsMenuOpen)}
              data-tooltip="Columns"
            >
              <ColumnsIcon />
              <span className="action-btn-text">Columns</span>
            </button>
            {columnsMenuOpen && (
              <div className="columns-menu">
                {columnOrder.map((columnKey) => {
                  const customColumn = customColumns[columnKey];
                  const label = customColumn ? customColumn.title : (columnTitles[columnKey] || columnKey);
                  const isVisible = columnKey === 'name' ? visibleColumns.name :
                                   columnKey === 'sourceLocation' ? visibleColumns.sourceLocation :
                                   columnKey === 'uploadedAt' ? visibleColumns.uploadedAt :
                                   (visibleColumns as any)[columnKey];

                  // Count visible columns
                  const visibleCount = Object.values(visibleColumns).filter(v => v).length;
                  const isLastVisible = visibleCount === 1 && isVisible;

                  return (
                    <label
                      key={columnKey}
                      className={`columns-menu-item ${draggedColumn === columnKey ? 'dragging' : ''} ${isLastVisible ? 'disabled' : ''}`}
                      draggable
                      onDragStart={() => handleDragStart(columnKey)}
                      onDragOver={(e) => handleDragOver(e, columnKey)}
                      onDragEnd={handleDragEnd}
                    >
                      <DragIcon />
                      <span>{label}</span>
                      <span
                        className="tooltip-wrapper column-check-icon"
                        data-tooltip={isLastVisible ? 'At least one column must be visible' : 'Click to hide column'}
                        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
                      >
                        <CheckIcon />
                      </span>
                      <input
                        type="checkbox"
                        checked={isVisible}
                        disabled={isLastVisible}
                        onChange={(e) => {
                          setVisibleColumns({...visibleColumns, [columnKey]: e.target.checked});
                        }}
                      />
                    </label>
                  );
                })}
                <div className="columns-menu-divider"></div>
                <div
                  className="columns-menu-item edit-columns-btn"
                  onClick={() => {
                    setShowColumnManager(true);
                    setColumnsMenuOpen(false);
                  }}
                >
                  <span>Edit Columns</span>
                </div>
              </div>
            )}
          </div>
          <button className="action-btn" data-tooltip="Save Search">
            <SaveIcon />
            <span className="action-btn-text">Save Search</span>
          </button>
        </div>
      </div>

      <div className="search-results-content" ref={tableRef}>
        <CustomTable
          data={dataWithCheckbox}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Info Sidebar */}
      {showInfo && (
        <div className="info-sidebar">
          <div className="info-sidebar-header">
            <h3>Information</h3>
            <button className="close-sidebar-btn" onClick={() => setShowInfo(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="info-sidebar-content">
            <div className="info-sidebar-section">
              <h4>Attributes</h4>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">Proteomics Study 3</div>
                <div className="info-sidebar-label">Study Name</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('Proteomics Study 3', 'sidebar-study-name')}>
                  {copiedId === 'sidebar-study-name' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">Protocol</div>
                <div className="info-sidebar-label">Document Type</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('Protocol', 'sidebar-doc-type')}>
                  {copiedId === 'sidebar-doc-type' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">Dr. Sarah Chen</div>
                <div className="info-sidebar-label">Principal Investigator</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('Dr. Sarah Chen', 'sidebar-pi')}>
                  {copiedId === 'sidebar-pi' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>

            <div className="info-sidebar-section">
              <h4>Information</h4>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">Proteomics-Study3-Protocol.txt</div>
                <div className="info-sidebar-label">File Name</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('Proteomics-Study3-Protocol.txt', 'sidebar-file-name')}>
                  {copiedId === 'sidebar-file-name' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">file-ps3-001</div>
                <div className="info-sidebar-label">File ID</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('file-ps3-001', 'sidebar-file-id')}>
                  {copiedId === 'sidebar-file-id' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">/tetrasphere/proteomics/study-3/docs</div>
                <div className="info-sidebar-label">File Path</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('/tetrasphere/proteomics/study-3/docs', 'sidebar-file-path')}>
                  {copiedId === 'sidebar-file-path' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">/tetrasphere/proteomics/study-3/docs</div>
                <div className="info-sidebar-label">Source Location</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('/tetrasphere/proteomics/study-3/docs', 'sidebar-source-location')}>
                  {copiedId === 'sidebar-source-location' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">01/09/2026, 04:30:00 PM EST</div>
                <div className="info-sidebar-label">Upload date</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('01/09/2026, 04:30:00 PM EST', 'sidebar-upload-date')}>
                  {copiedId === 'sidebar-upload-date' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">Text Document</div>
                <div className="info-sidebar-label">Source Type</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('Text Document', 'sidebar-source-type')}>
                  {copiedId === 'sidebar-source-type' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-sidebar-item">
                <div className="info-sidebar-value">18.5 KB</div>
                <div className="info-sidebar-label">Size</div>
                <button className="copy-btn-sidebar" onClick={() => handleCopy('18.5 KB', 'sidebar-size')}>
                  {copiedId === 'sidebar-size' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`toast-notification ${toast.fadeOut ? 'fade-out' : ''}`}>
          {toast.message}
        </div>
      )}

      {/* Column Manager Modal */}
      {showColumnManager && (
        <div className="modal-overlay" onClick={() => setShowColumnManager(false)}>
          <div className="column-manager-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Columns</h2>
              <button className="modal-close-btn" onClick={() => setShowColumnManager(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="column-manager-section">
                <div className="current-columns-list">
                  {columnOrder.map((columnKey, index) => {
                    const customColumn = customColumns[columnKey];
                    const defaultTitles: { [key: string]: string } = {
                      name: 'Name',
                      sourceLocation: 'Source Location',
                      uploadedAt: 'Uploaded At',
                    };
                    const originalName = customColumn
                      ? availableColumnTypes.find(t => t.id === customColumn.type)?.label || customColumn.type
                      : defaultTitles[columnKey] || columnKey;
                    const displayName = customColumn ? customColumn.title : (columnTitles[columnKey] || defaultTitles[columnKey] || columnKey);
                    const isCustomColumn = !!customColumn;

                    return (
                      <div
                        key={columnKey}
                        className={`current-column-item ${draggedModalColumn === columnKey ? 'dragging' : ''}`}
                        draggable
                        onDragStart={() => setDraggedModalColumn(columnKey)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (draggedModalColumn && draggedModalColumn !== columnKey) {
                            const newOrder = [...columnOrder];
                            const draggedIndex = newOrder.indexOf(draggedModalColumn);
                            const targetIndex = newOrder.indexOf(columnKey);

                            newOrder.splice(draggedIndex, 1);
                            newOrder.splice(targetIndex, 0, draggedModalColumn);

                            setColumnOrder(newOrder);
                          }
                        }}
                        onDragEnd={() => setDraggedModalColumn(null)}
                      >
                        <DragIcon />
                        <label className="column-checkbox-label">
                          <input
                            type="checkbox"
                            checked={
                              columnKey === 'name' ? visibleColumns.name :
                              columnKey === 'sourceLocation' ? visibleColumns.sourceLocation :
                              columnKey === 'uploadedAt' ? visibleColumns.uploadedAt :
                              true
                            }
                            onChange={(e) => {
                              if (columnKey === 'name' || columnKey === 'sourceLocation' || columnKey === 'uploadedAt') {
                                setVisibleColumns({
                                  ...visibleColumns,
                                  [columnKey]: e.target.checked
                                } as any);
                              }
                            }}
                            disabled={
                              (columnKey === 'name' && visibleColumns.name && !visibleColumns.sourceLocation && !visibleColumns.uploadedAt) ||
                              (columnKey === 'sourceLocation' && visibleColumns.sourceLocation && !visibleColumns.name && !visibleColumns.uploadedAt) ||
                              (columnKey === 'uploadedAt' && visibleColumns.uploadedAt && !visibleColumns.name && !visibleColumns.sourceLocation)
                            }
                            className="column-checkbox"
                          />
                          <span style={{
                            visibility: (columnKey === 'name' ? visibleColumns.name :
                              columnKey === 'sourceLocation' ? visibleColumns.sourceLocation :
                              columnKey === 'uploadedAt' ? visibleColumns.uploadedAt :
                              true) ? 'visible' : 'hidden'
                          }}>
                            <CheckIcon />
                          </span>
                        </label>
                        <div className="column-info">
                          <div className="column-original-name">{originalName}</div>
                          <input
                            type="text"
                            value={displayName}
                            onChange={(e) => {
                              if (isCustomColumn) {
                                setCustomColumns({
                                  ...customColumns,
                                  [columnKey]: { ...customColumn, title: e.target.value }
                                });
                              } else {
                                setColumnTitles({
                                  ...columnTitles,
                                  [columnKey]: e.target.value
                                });
                              }
                            }}
                            placeholder="Display name"
                            className="column-title-input"
                          />
                        </div>
                        <button
                          className="remove-column-btn"
                          onClick={() => {
                            if (isCustomColumn) {
                              const newColumns = { ...customColumns };
                              delete newColumns[columnKey];
                              setCustomColumns(newColumns);
                            }
                            setColumnOrder(columnOrder.filter(k => k !== columnKey));
                            const newVisibleColumns = { ...visibleColumns };
                            delete (newVisibleColumns as any)[columnKey];
                            setVisibleColumns(newVisibleColumns);
                          }}
                          disabled={columnOrder.length === 1}
                          aria-label="Remove column"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="column-manager-section add-column-section">
                <select
                  className="add-column-select"
                  value={selectedNewColumn}
                  onChange={(e) => {
                    const columnType = availableColumnTypes.find(t => t.id === e.target.value);
                    if (columnType) {
                      // Check if it's a default column being re-added
                      if (columnType.id === 'name' || columnType.id === 'sourceLocation' || columnType.id === 'uploadedAt') {
                        setColumnOrder([...columnOrder, columnType.id]);
                        setVisibleColumns({ ...visibleColumns, [columnType.id]: true } as any);
                      } else {
                        // It's a custom column
                        const newKey = `custom_${columnType.id}_${Date.now()}`;
                        setCustomColumns({
                          ...customColumns,
                          [newKey]: { type: columnType.id, title: columnType.label }
                        });
                        setColumnOrder([...columnOrder, newKey]);
                        setVisibleColumns({ ...visibleColumns, [newKey]: true } as any);
                      }
                      setSelectedNewColumn('');
                    }
                  }}
                >
                  <option value="">Add column...</option>
                  {availableColumnTypes
                    .filter((columnType) => {
                      // Check if this column type is already added
                      return !Object.values(customColumns).some(col => col.type === columnType.id);
                    })
                    .map((columnType) => (
                      <option key={columnType.id} value={columnType.id}>
                        {columnType.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn modal-btn-secondary" onClick={() => setShowColumnManager(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content modal-content-medium" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Share "{shareItemName}"</h2>
              <button
                className="modal-close"
                onClick={() => setShowShareModal(false)}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">Share this item with others by copying the link below:</p>
              <div className="share-url-container">
                <input
                  type="text"
                  className="share-url-input"
                  value={shareUrl}
                  readOnly
                />
                <button
                  className="share-copy-btn"
                  onClick={handleCopyLink}
                  title="Copy link"
                  aria-label="Copy link"
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn-cancel"
                onClick={() => setShowShareModal(false)}
              >
                Close
              </button>
              <button
                className="modal-btn-save"
                onClick={handleCopyLink}
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      <SearchAssistant
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        onBuildFilters={() => {
          setShowFilterView(true);
        }}
        onAddFilter={handleAddFilter}
        onSetFilterValue={handleSetFilterValue}
        activeFilters={activeFilters}
        lastRemovedFilter={lastRemovedFilter}
        onFilterRemovalHandled={() => setLastRemovedFilter(null)}
        onSearch={(searchType) => {
          console.log('onSearch called with searchType:', searchType);
          setShowFilterView(false);
          setSelectedRows(new Set());
          setSelectAll(false);
          if (searchType === 'chromatography') {
            setCurrentSearchType('chromatography');
            setSearchQuery('All chromatography data for the last 2 weeks');
          } else if (searchType === 'proteomics') {
            setCurrentSearchType('proteomics');
            setSearchQuery('All data for proteomics study 3');
          }
          // If searchType is null, just close the filter panel (search with current filters)
        }}
        onSaveFilter={() => {
          // TODO: Implement save filter modal/functionality
          setToast({ message: 'Filter saved successfully', visible: true, fadeOut: false });
        }}
      />
    </div>
  );
}

export default SearchResultsPage;

