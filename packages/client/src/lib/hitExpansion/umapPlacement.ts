// ============================================================
// Place user SMILES into UMAP space via nearest-neighbor interp
// ============================================================

import { MOLECULE_LIBRARY } from '../../data/moleculeLibrary';
import { computeFingerprint, tanimotoSimilarity } from './fingerprints';

export function placeMolecule(smiles: string): { x: number; y: number } {
  const fp = computeFingerprint(smiles);
  const scored = MOLECULE_LIBRARY.map((mol) => ({
    mol,
    sim: tanimotoSimilarity(fp, computeFingerprint(mol.smiles)),
  }))
    .filter((s) => s.sim > 0)
    .sort((a, b) => b.sim - a.sim)
    .slice(0, 5);

  if (scored.length === 0) return { x: 0, y: 0 };

  let wSum = 0;
  let wx = 0;
  let wy = 0;
  for (const { mol, sim } of scored) {
    wx += mol.umap_x * sim;
    wy += mol.umap_y * sim;
    wSum += sim;
  }

  return { x: wx / wSum, y: wy / wSum };
}
