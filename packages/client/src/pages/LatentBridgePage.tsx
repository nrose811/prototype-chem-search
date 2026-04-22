import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MOLECULE_LIBRARY, EXAMPLE_MOLECULES } from '../data/moleculeLibrary';
import { placeMolecule } from '../lib/hitExpansion/umapPlacement';
import {
  runLatentBridgeGeneration,
  DEFAULT_SAMPLING,
  type GeneratedMolecule,
  type SamplingParams,
} from '../lib/hitExpansion/generationEngine';
import ChemicalSpaceMap from '../components/hitExpansion/ChemicalSpaceMap';
import PropertyTable from '../components/hitExpansion/PropertyTable';
import CartDrawer from '../components/hitExpansion/CartDrawer';
import GenerationProgress from '../components/hitExpansion/GenerationProgress';
import MoleculeViewer from '../components/hitExpansion/MoleculeViewer';
import './LatentBridgePage.css';

type AppState = 'idle' | 'generating' | 'results' | 'error';

function LatentBridgePage() {
  // Anchors
  const [smilesA, setSmilesA] = useState('');
  const [smilesB, setSmilesB] = useState('');

  // Sampling
  const [params, setParams] = useState<SamplingParams>(DEFAULT_SAMPLING);

  // State
  const [state, setState] = useState<AppState>('idle');
  const [progress, setProgress] = useState(0);
  const [generated, setGenerated] = useState<GeneratedMolecule[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Cart
  const [cart, setCart] = useState<Map<string, GeneratedMolecule>>(new Map());
  const [cartOpen, setCartOpen] = useState(false);

  const canGenerate = smilesA.trim().length > 0 && smilesB.trim().length > 0;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setState('generating');
    setProgress(0);
    setGenerated([]);
    setSelectedId(null);
    setErrorMsg('');

    try {
      const posA = placeMolecule(smilesA);
      const posB = placeMolecule(smilesB);
      const results = await runLatentBridgeGeneration(
        smilesA, smilesB, posA, posB, params,
        (pct) => setProgress(pct),
      );
      setGenerated(results);
      setState('results');
    } catch (e) {
      setErrorMsg(String(e));
      setState('error');
    }
  }, [smilesA, smilesB, params, canGenerate]);

  const toggleCart = useCallback((mol: GeneratedMolecule) => {
    setCart((prev) => {
      const next = new Map(prev);
      if (next.has(mol.id)) next.delete(mol.id);
      else next.set(mol.id, mol);
      return next;
    });
  }, []);

  // Anchor positions for map
  const anchorPoints = [];
  if (smilesA) {
    const p = placeMolecule(smilesA);
    anchorPoints.push({ id: 'anchor-a', name: 'Parent A', umap_x: p.x, umap_y: p.y });
  }
  if (smilesB) {
    const p = placeMolecule(smilesB);
    anchorPoints.push({ id: 'anchor-b', name: 'Parent B', umap_x: p.x, umap_y: p.y });
  }

  return (
    <div className="he-bridge-layout">
      {/* Sidebar */}
      <div className="he-bridge-sidebar">
        <Link to="/apps/hit-expansion" className="he-back-link">&larr; Hit Expansion</Link>
        <h2 className="he-sidebar-title">Latent Bridge</h2>

        {/* Anchor A */}
        <div className="he-anchor-section">
          <label className="he-label">Parent A (SMILES)</label>
          {smilesA && (
            <div className="he-anchor-preview">
              <MoleculeViewer smiles={smilesA} width={200} height={100} />
            </div>
          )}
          <input
            className="he-smiles-input"
            value={smilesA}
            onChange={(e) => setSmilesA(e.target.value)}
            placeholder="Enter SMILES..."
          />
          <ExampleDropdown onSelect={setSmilesA} />
        </div>

        {/* Anchor B */}
        <div className="he-anchor-section">
          <label className="he-label">Parent B (SMILES)</label>
          {smilesB && (
            <div className="he-anchor-preview">
              <MoleculeViewer smiles={smilesB} width={200} height={100} />
            </div>
          )}
          <input
            className="he-smiles-input"
            value={smilesB}
            onChange={(e) => setSmilesB(e.target.value)}
            placeholder="Enter SMILES..."
          />
          <ExampleDropdown onSelect={setSmilesB} />
        </div>

        {/* Sampling */}
        <SamplingControls params={params} onChange={setParams} />

        {/* Generate */}
        <button
          className="he-generate-btn"
          disabled={!canGenerate || state === 'generating'}
          onClick={handleGenerate}
        >
          {state === 'generating' ? 'Generating...' : 'Generate Molecules'}
        </button>
      </div>

      {/* Main */}
      <div className="he-bridge-main">
        {/* Cart button */}
        <button className="he-cart-fab" onClick={() => setCartOpen(true)}>
          🛒 {cart.size > 0 && <span className="he-cart-badge">{cart.size}</span>}
        </button>

        {state === 'idle' && (
          <div className="he-empty-state">
            <p>Enter two anchor molecules and click <strong>Generate</strong> to explore chemical space between them.</p>
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

// ── Sub-components ───────────────────────────────────────────

function ExampleDropdown({ onSelect }: { onSelect: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="he-examples-wrapper">
      <button className="he-examples-btn" onClick={() => setOpen(!open)}>
        Examples ▾
      </button>
      {open && (
        <div className="he-examples-dropdown">
          {EXAMPLE_MOLECULES.map((m) => (
            <button
              key={m.name}
              className="he-examples-item"
              onClick={() => { onSelect(m.smiles); setOpen(false); }}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SamplingControls({
  params,
  onChange,
}: {
  params: SamplingParams;
  onChange: (p: SamplingParams) => void;
}) {
  return (
    <div className="he-sampling-section">
      <label className="he-label">Sampling</label>

      <div className="he-method-toggle">
        {(['greedy', 'topk', 'topp'] as const).map((m) => (
          <button
            key={m}
            className={`he-method-btn ${params.method === m ? 'active' : ''}`}
            onClick={() => onChange({ ...params, method: m })}
          >
            {m === 'greedy' ? 'Greedy' : m === 'topk' ? 'Top-K' : 'Top-P'}
          </button>
        ))}
      </div>

      <div className="he-param-row">
        <label>Count (N)</label>
        <input
          type="number"
          min={1} max={50}
          value={params.n}
          onChange={(e) => onChange({ ...params, n: Number(e.target.value) })}
          className="he-param-input"
        />
      </div>

      {params.method !== 'greedy' && (
        <div className="he-param-row">
          <label>Temperature</label>
          <input
            type="range"
            min={0.1} max={2.0} step={0.1}
            value={params.temperature}
            onChange={(e) => onChange({ ...params, temperature: Number(e.target.value) })}
          />
          <span className="he-param-value">{params.temperature.toFixed(1)}</span>
        </div>
      )}

      {params.method === 'topk' && (
        <div className="he-param-row">
          <label>K</label>
          <input
            type="number"
            min={1} max={50}
            value={params.k}
            onChange={(e) => onChange({ ...params, k: Number(e.target.value) })}
            className="he-param-input"
          />
        </div>
      )}

      {params.method === 'topp' && (
        <div className="he-param-row">
          <label>P</label>
          <input
            type="range"
            min={0.1} max={1.0} step={0.05}
            value={params.p}
            onChange={(e) => onChange({ ...params, p: Number(e.target.value) })}
          />
          <span className="he-param-value">{params.p.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}

export default LatentBridgePage;
