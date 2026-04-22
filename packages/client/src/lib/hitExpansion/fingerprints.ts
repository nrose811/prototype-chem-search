// ============================================================
// Atom-pair fingerprints + Tanimoto similarity
// ============================================================

const ATOM_RE = /[BCNOPSFIbcnops]|Br|Cl|\[.*?\]/g;

function tokenize(smiles: string): string[] {
  return smiles.match(ATOM_RE) ?? [];
}

function fnvHash(a: string, b: string, dist: number): number {
  const s = `${a}|${b}|${dist}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h % 4096;
}

export type Fingerprint = Set<number>;

export function computeFingerprint(smiles: string): Fingerprint {
  const atoms = tokenize(smiles);
  const fp = new Set<number>();
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j <= Math.min(i + 4, atoms.length - 1); j++) {
      fp.add(fnvHash(atoms[i], atoms[j], j - i));
    }
  }
  return fp;
}

export function tanimotoSimilarity(a: Fingerprint, b: Fingerprint): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const bit of a) {
    if (b.has(bit)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
