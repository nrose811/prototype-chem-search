// ============================================================
// Local mock generation engine — Latent Bridge + Radial
// ============================================================

import { MOLECULE_LIBRARY, type LibraryMolecule } from '../../data/moleculeLibrary';
import { computeFingerprint, tanimotoSimilarity, type Fingerprint } from './fingerprints';

export type SamplingMethod = 'greedy' | 'topk' | 'topp';

export interface SamplingParams {
  method: SamplingMethod;
  temperature: number;
  k: number;
  p: number;
  n: number;
}

export interface GeneratedMolecule extends LibraryMolecule {
  simA: number;
  simB: number;
  score: number;
}

export const DEFAULT_SAMPLING: SamplingParams = {
  method: 'greedy',
  temperature: 1.0,
  k: 10,
  p: 0.9,
  n: 15,
};

// ── Helpers ──────────────────────────────────────────────────

function softmax(scores: number[], temp: number): number[] {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp((s - max) / temp));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function sampleWeighted(probs: number[]): number {
  let r = Math.random();
  for (let i = 0; i < probs.length; i++) {
    r -= probs[i];
    if (r <= 0) return i;
  }
  return probs.length - 1;
}

function gaussian(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2);
}

// ── Latent Bridge Generation ─────────────────────────────────

export async function runLatentBridgeGeneration(
  smilesA: string,
  smilesB: string,
  anchorA: { x: number; y: number },
  anchorB: { x: number; y: number },
  params: SamplingParams,
  onProgress?: (pct: number) => void,
): Promise<GeneratedMolecule[]> {
  const fpA = computeFingerprint(smilesA);
  const fpB = computeFingerprint(smilesB);

  // Score library
  const scored = MOLECULE_LIBRARY.map((mol) => {
    const fp = computeFingerprint(mol.smiles);
    const simA = tanimotoSimilarity(fp, fpA);
    const simB = tanimotoSimilarity(fp, fpB);
    return { mol, simA, simB, score: (simA + simB) / 2 };
  }).sort((a, b) => b.score - a.score);

  // Simulate progress
  for (let i = 0; i <= 20; i++) {
    onProgress?.(Math.min((i / 20) * 95, 95));
    await new Promise((r) => setTimeout(r, 60));
  }

  // Sample
  const selected = sample(scored, params);

  // Build results
  const results: GeneratedMolecule[] = selected.map((s, i) => {
    const t = s.simA / (s.simA + s.simB + 1e-8);
    const noise = (1 - s.score) * 0.4;
    return {
      ...s.mol,
      id: `GEN-${String(i + 1).padStart(3, '0')}`,
      simA: Math.round(s.simA * 1000) / 1000,
      simB: Math.round(s.simB * 1000) / 1000,
      score: Math.round(s.score * 1000) / 1000,
      umap_x: anchorA.x + (anchorB.x - anchorA.x) * t + gaussian() * noise,
      umap_y: anchorA.y + (anchorB.y - anchorA.y) * t + gaussian() * noise,
    };
  });

  onProgress?.(100);
  return results;
}

// ── Radial Expansion Generation ──────────────────────────────

export interface ThresholdItem {
  key: string;
  weight: number;
  value: number;
}

export async function runRadialGeneration(
  pivotSmiles: string,
  pivotPos: { x: number; y: number },
  params: SamplingParams,
  similarityThreshold: number,
  thresholds: ThresholdItem[],
  onProgress?: (pct: number) => void,
): Promise<GeneratedMolecule[]> {
  const fpPivot = computeFingerprint(pivotSmiles);

  // Filter by similarity threshold + property thresholds
  const candidates = MOLECULE_LIBRARY
    .map((mol) => {
      const sim = tanimotoSimilarity(computeFingerprint(mol.smiles), fpPivot);
      return { mol, simA: sim, simB: sim, score: sim };
    })
    .filter((c) => c.simA >= similarityThreshold * 0.3) // relaxed for mock
    .filter((c) => {
      for (const t of thresholds) {
        if (t.weight === 0) continue;
        const val = (c.mol as unknown as Record<string, unknown>)[t.key];
        if (typeof val === 'number' && val > t.value * 1.5) return false;
      }
      return true;
    })
    .sort((a, b) => b.score - a.score);

  for (let i = 0; i <= 20; i++) {
    onProgress?.(Math.min((i / 20) * 95, 95));
    await new Promise((r) => setTimeout(r, 60));
  }

  const selected = sample(candidates, params);
  const n = selected.length;

  const results: GeneratedMolecule[] = selected.map((s, i) => {
    const radius = (1 - s.simA) * 2.5 + 0.3;
    const angle = (i / n) * 2 * Math.PI + gaussian() * 0.15;
    return {
      ...s.mol,
      id: `GEN-${String(i + 1).padStart(3, '0')}`,
      simA: Math.round(s.simA * 1000) / 1000,
      simB: Math.round(s.simB * 1000) / 1000,
      score: Math.round(s.score * 1000) / 1000,
      umap_x: pivotPos.x + radius * Math.cos(angle) + gaussian() * 0.1,
      umap_y: pivotPos.y + radius * Math.sin(angle) + gaussian() * 0.1,
    };
  });

  onProgress?.(100);
  return results;
}

// ── Sampling ─────────────────────────────────────────────────

function sample<T extends { score: number }>(
  pool: T[],
  params: SamplingParams,
): T[] {
  if (pool.length === 0) return [];
  const n = Math.min(params.n, 50);

  switch (params.method) {
    case 'greedy': {
      const results: T[] = [];
      for (let i = 0; i < n; i++) {
        results.push(pool[i % pool.length]);
      }
      return results;
    }
    case 'topk': {
      const topK = pool.slice(0, Math.min(params.k, pool.length));
      const scores = topK.map((c) => c.score);
      const probs = softmax(scores, params.temperature);
      const results: T[] = [];
      for (let i = 0; i < n; i++) {
        results.push(topK[sampleWeighted(probs)]);
      }
      return results;
    }
    case 'topp': {
      const scores = pool.map((c) => c.score);
      const probs = softmax(scores, params.temperature);
      // Nucleus: cumulative prob >= p
      const sorted = probs
        .map((p, i) => ({ p, i }))
        .sort((a, b) => b.p - a.p);
      let cumul = 0;
      const nucleus: typeof sorted = [];
      for (const item of sorted) {
        nucleus.push(item);
        cumul += item.p;
        if (cumul >= params.p) break;
      }
      const nucProbs = nucleus.map((n) => n.p);
      const nucSum = nucProbs.reduce((a, b) => a + b, 0);
      const normProbs = nucProbs.map((p) => p / nucSum);
      const results: T[] = [];
      for (let i = 0; i < n; i++) {
        const idx = sampleWeighted(normProbs);
        results.push(pool[nucleus[idx].i]);
      }
      return results;
    }
  }
}
