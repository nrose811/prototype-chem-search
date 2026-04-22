// ============================================================
// Fast heuristic molecular property estimates
// ============================================================

const ATOM_WEIGHTS: Record<string, number> = {
  C: 12, N: 14, O: 16, S: 32, F: 19, Cl: 35.5, Br: 80, P: 31, I: 127,
  c: 12, n: 14, o: 16, s: 32, p: 31, b: 11, B: 11,
};

export function estimateMW(smiles: string): number {
  let mw = 0;
  const atoms = smiles.match(/[A-Z][a-z]?/g) ?? [];
  for (const a of atoms) {
    mw += ATOM_WEIGHTS[a] ?? 12;
  }
  return Math.round(mw * 1.08); // +8% for implied H
}

export function estimateLogP(smiles: string): number {
  let logp = 0;
  const aroC = (smiles.match(/c/g) ?? []).length;
  const aliC = (smiles.match(/C/g) ?? []).length;
  logp += aroC * 0.29 + aliC * 0.49;
  logp -= (smiles.match(/N|n/g) ?? []).length * 0.72;
  logp -= (smiles.match(/O|o/g) ?? []).length * 0.64;
  logp += (smiles.match(/F/g) ?? []).length * 0.37;
  logp += (smiles.match(/Cl/g) ?? []).length * 0.92;
  logp -= (smiles.match(/S|s/g) ?? []).length * 0.01;
  logp -= (smiles.match(/\(/g) ?? []).length * 0.12; // ring penalty heuristic
  return Math.round(logp * 10) / 10;
}

export function estimateHBD(smiles: string): number {
  const nh = (smiles.match(/\[NH\]|N[^(=)]/g) ?? []).length;
  const oh = (smiles.match(/O[^(=)]/g) ?? []).length;
  return Math.min(nh + oh, 8);
}

export function estimateHBA(smiles: string): number {
  return (smiles.match(/[NnOo]/g) ?? []).length;
}

// Seeded pseudorandom from FNV-1a
export function seededRandom(id: string, salt: string, min: number, max: number): number {
  const s = `${id}:${salt}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  const t = (h & 0xffff) / 0xffff;
  return Math.round((min + t * (max - min)) * 100) / 100;
}

export interface EnrichedProperties {
  psa: number;
  clogp: number;
  logd: number;
  alogd: number;
  sfi: number;
  heavyAtoms: number;
  saScore: number;
  lipE: number;
  mpoScore: number;
  rcaom: number;
  fractionCSP3: number;
  rotatableBonds: number;
}

export function enrichProperties(
  id: string,
  mw: number,
  logp: number,
  hbd: number,
  hba: number,
  simA: number,
): EnrichedProperties {
  const psa = 20 * hbd + 17 * hba;
  const clogp = Math.round(logp * 10) / 10;
  const logd = Math.round((logp - 0.5) * 10) / 10;
  const alogd = Math.round(logp * 0.85 * 10) / 10;
  const sfi = Math.round((logp + psa / 100) * 10) / 10;
  const heavyAtoms = Math.round(mw / 13);

  return {
    psa,
    clogp,
    logd,
    alogd,
    sfi,
    heavyAtoms,
    saScore: seededRandom(id, 'sa', 1.5, 4.5),
    lipE: Math.round((simA * 8 - logp) * 10) / 10,
    mpoScore: seededRandom(id, 'mpo', 0.4, 1.0),
    rcaom: Math.round(seededRandom(id, 'rc', 1, 4)),
    fractionCSP3: seededRandom(id, 'fsp3', 0.1, 0.7),
    rotatableBonds: Math.round(seededRandom(id, 'rb', 2, 9)),
  };
}
