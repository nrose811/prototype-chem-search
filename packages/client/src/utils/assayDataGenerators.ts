import { SpreadsheetData } from '../components/SpreadsheetViewer';
import { DemoFile } from '../mocks/demoData';

// ---- Seeded random helper (deterministic per fileId) ----
function seedHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function seededRand(seed: number, i: number): number {
  const x = Math.sin(seed + i) * 10000;
  return x - Math.floor(x);
}

export interface TimelineEvent { id: string; eventType: string; actor: string; timestamp: string; detail: string; }

// ---- Generate mock spreadsheet data by assay type ----
export function generateSourceData(file: DemoFile): SpreadsheetData {
  const s = seedHash(file.fileId);
  const batchNum = 100 + (s % 200);
  const sid = (i: number) => `S-${batchNum}-${String(i + 1).padStart(2, '0')}`;
  const vary = (base: number, i: number, pct = 0.03) => {
    const delta = (seededRand(s, i) - 0.5) * 2 * pct * base;
    return +(base + delta).toFixed(2);
  };

  switch (file.assayType) {
    case 'Potency':
      return {
        columns: ['Sample ID', 'Analyte', 'Raw Area', 'Std Area', 'Conc (mg/mL)', 'Assay %', 'Spec', 'Result'],
        rows: [0, 1, 2].map((i) => ({ rowNumber: i + 1, cells: [
          { value: sid(i) }, { value: 'Active Compound A' },
          { value: Math.round(vary(525000, i, 0.02)) }, { value: 529330 },
          { value: vary(9.95, i) }, { value: vary(99.5, i) },
          { value: '95.0–105.0%' }, { value: 'Pass' },
        ] })),
      };
    case 'Purity':
      return {
        columns: ['Sample ID', 'Analyte', 'Peak Area', 'RRT', 'Result %', 'Limit', 'Result'],
        rows: [0, 1, 2].map((i) => ({ rowNumber: i + 1, cells: [
          { value: sid(i) }, { value: i < 2 ? 'Impurity B' : 'Total Impurities' },
          { value: Math.round(vary(5800, i, 0.1)) }, { value: i < 2 ? 0.85 : '-' },
          { value: vary(i < 2 ? 0.11 : 0.32, i, 0.15) },
          { value: i < 2 ? '≤ 0.5%' : '≤ 2.0%' }, { value: 'Pass' },
        ] })),
      };
    case 'Identity':
      return {
        columns: ['Sample ID', 'Analyte', 'Observed m/z', 'Expected m/z', 'Delta (Da)', 'Tolerance', 'Result'],
        rows: [0, 1, 2].map((i) => {
          const expected = [384.20, 256.14, 512.28][i];
          const observed = vary(expected, i, 0.001);
          return { rowNumber: i + 1, cells: [
            { value: sid(i) }, { value: ['MW Confirmation', 'Fragment Ion A', 'Dimer Confirmation'][i] },
            { value: observed }, { value: expected },
            { value: +Math.abs(observed - expected).toFixed(3) },
            { value: '± 0.5 Da' }, { value: 'Pass' },
          ] };
        }),
      };
    case 'Stability':
      return {
        columns: ['Sample ID', 'Analyte', 'Time Point', 'Assay %', 'Degradation %', 'Spec', 'Result'],
        rows: ['T=0', 'T=1mo', 'T=3mo', 'T=6mo'].map((tp, i) => ({ rowNumber: i + 1, cells: [
          { value: sid(0) }, { value: 'Active Compound A' }, { value: tp },
          { value: vary(99.5 - i * 0.3, i) }, { value: vary(i * 0.15, i, 0.2) },
          { value: '≥ 95.0%' }, { value: 'Pass' },
        ] })),
      };
    case 'Dissolution':
      return {
        columns: ['Sample ID', 'Time (min)', 'pH', '% Dissolved', 'Spec', 'Result'],
        rows: [5, 10, 15, 30, 45].map((t, i) => ({ rowNumber: i + 1, cells: [
          { value: sid(0) }, { value: t }, { value: vary(6.8, i, 0.01) },
          { value: vary(20 + i * 18, i, 0.03) },
          { value: t >= 30 ? '≥ 80% at 30 min' : '-' },
          { value: t < 30 ? '-' : 'Pass' },
        ] })),
      };
    case 'Content Uniformity':
      return {
        columns: ['Unit #', 'Weight (mg)', 'Assay (mg)', 'Label Claim %', 'Spec', 'Result'],
        rows: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({ rowNumber: i + 1, cells: [
          { value: i + 1 }, { value: vary(200.0, i, 0.005) },
          { value: vary(100.2, i, 0.02) }, { value: vary(100.2, i + 10, 0.02) },
          { value: '85.0–115.0%' }, { value: 'Pass' },
        ] })),
      };
    default:
      return generateDefaultAssayData(file.assayType, sid, vary);
  }
}

function generateDefaultAssayData(
  assayType: string,
  sid: (i: number) => string,
  vary: (base: number, i: number, pct?: number) => number,
): SpreadsheetData {
  // continued in next section below
  switch (assayType) {
    case 'Residual Solvents':
      return {
        columns: ['Sample ID', 'Solvent', 'Detected (ppm)', 'ICH Limit (ppm)', 'Result'],
        rows: ([['Methanol', 2200, 3000], ['Acetone', 1800, 5000], ['Ethanol', 1500, 5000],
          ['Dichloromethane', 120, 600], ['Ethyl Acetate', 1650, 5000]] as [string, number, number][])
          .map(([solvent, det, limit], i) => ({ rowNumber: i + 1, cells: [
            { value: sid(0) }, { value: solvent },
            { value: Math.round(vary(det, i, 0.08)) }, { value: limit }, { value: 'Pass' },
          ] })),
      };
    case 'Water Content':
      return {
        columns: ['Sample ID', 'Replicate', 'Weight (mg)', 'Water Found (µg)', 'Water Content %', 'Spec', 'Result'],
        rows: [0, 1, 2].map((i) => ({ rowNumber: i + 1, cells: [
          { value: sid(0) }, { value: `Rep ${i + 1}` },
          { value: vary(105.2, i, 0.01) }, { value: vary(420, i, 0.05) },
          { value: vary(0.40, i, 0.08) }, { value: '≤ 1.0%' }, { value: 'Pass' },
        ] })),
      };
    case 'Particle Size':
      return {
        columns: ['Sample ID', 'D10 (µm)', 'D50 (µm)', 'D90 (µm)', 'Span', 'Spec (D90)', 'Result'],
        rows: [0, 1, 2].map((i) => ({ rowNumber: i + 1, cells: [
          { value: sid(i) }, { value: vary(12.4, i, 0.04) },
          { value: vary(45.6, i, 0.03) }, { value: vary(112.8, i, 0.03) },
          { value: vary(2.20, i, 0.05) }, { value: '≤ 150 µm' }, { value: 'Pass' },
        ] })),
      };
    case 'Sterility':
      return {
        columns: ['Sample ID', 'Medium', 'Incubation (days)', 'Temperature (°C)', 'Growth Observed', 'Result'],
        rows: ([['FTM', 14, 32.5], ['TSB', 14, 22.5], ['FTM (positive ctrl)', 3, 32.5]] as [string, number, number][])
          .map(([medium, days, temp], i) => ({ rowNumber: i + 1, cells: [
            { value: sid(0) }, { value: medium }, { value: days }, { value: temp },
            { value: i === 2 ? 'Yes' : 'No' }, { value: i === 2 ? 'Control Valid' : 'Pass' },
          ] })),
      };
    default:
      return {
        columns: ['Sample ID', 'Parameter', 'Value', 'Unit', 'Spec', 'Result'],
        rows: [0, 1, 2].map((i) => ({ rowNumber: i + 1, cells: [
          { value: sid(i) }, { value: `Measurement ${i + 1}` },
          { value: vary(98.5, i) }, { value: 'mg/mL' }, { value: '95.0–105.0' }, { value: 'Pass' },
        ] })),
      };
  }
}



// ---- Generate audit trail events for any file ----
const ACTORS = ['j.doe@lab.com', 's.smith@lab.com', 'm.johnson@lab.com', 'a.williams@lab.com'];

export function generateTimelineEvents(file: DemoFile): TimelineEvent[] {
  const s = seedHash(file.fileId);
  const uploadDate = new Date(file.uploadedAt);
  const actor = ACTORS[s % ACTORS.length];
  const iso = (d: Date) => d.toISOString();

  const events: TimelineEvent[] = [
    { id: `${file.fileId}-tl-1`, eventType: 'File Created', actor: 'System Agent', timestamp: iso(uploadDate), detail: `Ingested from ${file.sourceSystem} pipeline` },
    { id: `${file.fileId}-tl-2`, eventType: 'Integrity Check', actor: 'Integrity-Bot', timestamp: iso(new Date(uploadDate.getTime() + 5000)), detail: `SHA-256 verified: ${file.sha256.slice(0, 16)}…` },
    { id: `${file.fileId}-tl-3`, eventType: 'Label Added', actor: actor, timestamp: iso(new Date(uploadDate.getTime() + 34 * 60000)), detail: 'esign:status set to Pending' },
  ];

  // Files with version > 1 get an extra version update event
  if (parseInt(file.versionId.replace('v', '')) > 1) {
    const updateDate = new Date(uploadDate.getTime() + 19 * 3600000);
    events.push(
      { id: `${file.fileId}-tl-4`, eventType: 'File Updated', actor: ACTORS[(s + 1) % ACTORS.length], timestamp: iso(updateDate), detail: `New Version (${file.versionId}) Detected` },
      { id: `${file.fileId}-tl-5`, eventType: 'Label Changed', actor: 'Integrity-Bot', timestamp: iso(new Date(updateDate.getTime() + 5000)), detail: 'esign:status reset to Pending' },
    );
  }

  return events;
}