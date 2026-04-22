import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MOLECULE_LIBRARY, EXAMPLE_MOLECULES } from '../data/moleculeLibrary';
import { placeMolecule } from '../lib/hitExpansion/umapPlacement';
import {
  runRadialGeneration,
  DEFAULT_SAMPLING,
  type GeneratedMolecule,
  type SamplingParams,
  type ThresholdItem,
} from '../lib/hitExpansion/generationEngine';
import ChemicalSpaceMap from '../components/hitExpansion/ChemicalSpaceMap';
import PropertyTable from '../components/hitExpansion/PropertyTable';
import CartDrawer from '../components/hitExpansion/CartDrawer';
import GenerationProgress from '../components/hitExpansion/GenerationProgress';
import MoleculeViewer from '../components/hitExpansion/MoleculeViewer';
import './RadialExpansionPage.css';

type AppState = 'idle' | 'generating' | 'results' | 'error';

const DEFAULT_THRESHOLDS: ThresholdItem[] = [
  { key: 'logp', weight: 0, value: 2.5 },
  { key: 'mw', weight: 0, value: 350 },
];

function RadialExpansionPage() {
  const [pivotSmiles, setPivotSmiles] = useState('');
  const [similarityThreshold, setSimilarityThreshold] = useState(0.75);
  const [thresholds, setThresholds] = useState<ThresholdItem[]>(DEFAULT_THRESHOLDS);
  const [params, setParams] = useState<SamplingParams>(DEFAULT_SAMPLING);

  const [state, setState] = useState<AppState>('idle');
  const [progress, setProgress] = useState(0);
  const [generated, setGenerated] = useState<GeneratedMolecule[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [cart, setCart] = useState<Map<string, GeneratedMolecule>>(new Map());
  const [cartOpen, setCartOpen] = useState(false);
  const [exOpen, setExOpen] = useState(false);

  const canGenerate = pivotSmiles.trim().length > 0;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setState('generating');
    setProgress(0);
    setGenerated([]);
    setSelectedId(null);

    try {
      const pivotPos = placeMolecule(pivotSmiles);
      const results = await runRadialGeneration(
        pivotSmiles, pivotPos, params, similarityThreshold, thresholds,
        (pct) => setProgress(pct),
      );
      setGenerated(results);
      setState('results');
    } catch (e) {
      setErrorMsg(String(e));
      setState('error');
    }
  }, [pivotSmiles, params, similarityThreshold, thresholds, canGenerate]);

  const toggleCart = useCallback((mol: GeneratedMolecule) => {
    setCart((prev) => {
      const next = new Map(prev);
      if (next.has(mol.id)) next.delete(mol.id);
      else next.set(mol.id, mol);
      return next;
    });
  }, []);

  const anchorPoints = pivotSmiles
    ? [{ id: 'pivot', name: 'Pivot', ...placeMolecule(pivotSmiles) }].map(a => ({
        ...a, umap_x: a.x, umap_y: a.y,
      }))
    : [];

  return (
    <div className="he-radial-layout">
      {/* Sidebar */}
      <div className="he-radial-sidebar">
        <Link to="/apps/hit-expansion" className="he-back-link">&larr; Hit Expansion</Link>
        <h2 className="he-sidebar-title">Radial Expansion</h2>

        {/* Pivot */}
        <div className="he-anchor-section">
          <label className="he-label">Pivot Molecule (SMILES)</label>
          {pivotSmiles && (
            <div className="he-anchor-preview">
              <MoleculeViewer smiles={pivotSmiles} width={200} height={100} />
            </div>
          )}
          <input
            className="he-smiles-input"
            value={pivotSmiles}
            onChange={(e) => setPivotSmiles(e.target.value)}
            placeholder="Enter SMILES..."
          />
          <div className="he-examples-wrapper">
            <button className="he-examples-btn" onClick={() => setExOpen(!exOpen)}>
              Examples ▾
            </button>
            {exOpen && (
              <div className="he-examples-dropdown">
                {EXAMPLE_MOLECULES.map((m) => (
                  <button
                    key={m.name}
                    className="he-examples-item"
                    onClick={() => { setPivotSmiles(m.smiles); setExOpen(false); }}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similarity threshold */}
        <div className="he-threshold-section">
          <label className="he-label">Similarity Threshold</label>
          <div className="he-param-row">
            <input
              type="range"
              min={0} max={1} step={0.05}
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
            />
            <span className="he-param-value">{similarityThreshold.toFixed(2)}</span>
          </div>
        </div>

        {/* Property thresholds */}
        <div className="he-threshold-section">
          <label className="he-label">Property Thresholds</label>
          {thresholds.map((t, i) => (
            <div key={t.key} className="he-prop-threshold">
              <span className="he-prop-key">{t.key}</span>
              <div className="he-prop-controls">
                <label className="he-prop-label">
                  Weight
                  <input
                    type="range"
                    min={0} max={10} step={1}
                    value={t.weight}
                    onChange={(e) => {
                      const next = [...thresholds];
                      next[i] = { ...t, weight: Number(e.target.value) };
                      setThresholds(next);
                    }}
                  />
                  <span>{t.weight}</span>
                </label>
                <label className="he-prop-label">
                  Value
                  <input
                    type="number"
                    value={t.value}
                    onChange={(e) => {
                      const next = [...thresholds];
                      next[i] = { ...t, value: Number(e.target.value) };
                      setThresholds(next);
                    }}
                    className="he-param-input"
                    style={{ width: 70 }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Sampling */}
        <div className="he-sampling-section">
          <label className="he-label">Sampling</label>
          <div className="he-method-toggle">
            {(['greedy', 'topk', 'topp'] as const).map((m) => (
              <button
                key={m}
                className={`he-method-btn ${params.method === m ? 'active' : ''}`}
                onClick={() => setParams({ ...params, method: m })}
              >
                {m === 'greedy' ? 'Greedy' : m === 'topk' ? 'Top-K' : 'Top-P'}
              </button>
            ))}
          </div>
          <div className="he-param-row">
            <label>Count (N)</label>
            <input
              type="number" min={1} max={50} value={params.n}
              onChange={(e) => setParams({ ...params, n: Number(e.target.value) })}
              className="he-param-input"
            />
          </div>
        </div>

        <button
          className="he-generate-btn"
          disabled={!canGenerate || state === 'generating'}
          onClick={handleGenerate}
        >
          {state === 'generating' ? 'Generating...' : 'Generate Molecules'}
        </button>
      </div>

      {/* Main */}
      <div className="he-radial-main">
        <button className="he-cart-fab" onClick={() => setCartOpen(true)}>
          🛒 {cart.size > 0 && <span className="he-cart-badge">{cart.size}</span>}
        </button>

        {state === 'idle' && (
          <div className="he-empty-state">
            <p>Enter a pivot molecule and click <strong>Generate</strong> to explore structurally similar compounds.</p>
          </div>
        )}

        {state === 'generating' && <GenerationProgress progress={progress} />}

        {state === 'error' && (
          <div className="he-error-state">
            <p>Generation failed: {errorMsg}</p>
            <button onClick={() => setState('idle')}>Try Again</button>
          </div>
        )}

        {state === 'results' && (
          <>
            <div className="he-map-panel">
              <ChemicalSpaceMap
                library={MOLECULE_LIBRARY}
                generated={generated}
                anchors={anchorPoints}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
            <div className="he-table-panel">
              <PropertyTable
                molecules={generated}
                selectedId={selectedId}
                onSelect={setSelectedId}
                cartIds={new Set(cart.keys())}
                onToggleCart={toggleCart}
              />
            </div>
          </>
        )}
      </div>

      <CartDrawer
        items={Array.from(cart.values())}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={(id) => setCart((prev) => { const n = new Map(prev); n.delete(id); return n; })}
        onClear={() => setCart(new Map())}
      />
    </div>
  );
}

export default RadialExpansionPage;
