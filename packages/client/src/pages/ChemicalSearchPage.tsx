import { useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import KetcherEditor, { type KetcherEditorHandle } from '../components/KetcherEditor';
import MoleculeCard from '../components/MoleculeCard';
import CustomTable from '../components/CustomTable';
import {
  searchCompounds,
  getFilesForCompound,
  formatFileSize,
  formatDate,
  fileTypeColor,
  lipinskiRuleOfFive,
  DEFAULT_SEARCH_OPTIONS,
  type ChemRegCompound,
  type SearchResult,
  type SearchOptions,
  type SearchMode,
  type SimilarityMetric,
  type PlatformFile,
} from '../mocks/chemRegData';
import './ChemicalSearchPage.css';

// ── Saved Searches ──────────────────────────────────────────

interface SavedSearch {
  id: string;
  name: string;
  smiles: string;
  options: SearchOptions;
  savedAt: string;
  resultCount: number;
}

const MOCK_SAVED_SEARCHES: SavedSearch[] = [
  { id: 'ss-1', name: 'Kinase scaffold similarity', smiles: 'CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5', options: { ...DEFAULT_SEARCH_OPTIONS, mode: 'similarity', metric: 'tanimoto', threshold: 0.3 }, savedAt: '2026-04-18T14:30:00Z', resultCount: 12 },
  { id: 'ss-2', name: 'Aspirin substructure', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O', options: { ...DEFAULT_SEARCH_OPTIONS, mode: 'substructure' }, savedAt: '2026-04-20T09:15:00Z', resultCount: 3 },
  { id: 'ss-3', name: 'JAK2 series — exact', smiles: 'CC1=NC(=CC(=N1)NC2=CC(=C(C=C2)C(=O)NC3=C(C=CC=C3F)S(=O)(=O)C)OC)N4CCNCC4', options: { ...DEFAULT_SEARCH_OPTIONS, mode: 'exact' }, savedAt: '2026-04-21T11:00:00Z', resultCount: 1 },
  { id: 'ss-4', name: 'Sulfonamide compounds', smiles: 'C1=CC=C(C=C1)S(=O)(=O)N', options: { ...DEFAULT_SEARCH_OPTIONS, mode: 'similarity', threshold: 0.2 }, savedAt: '2026-04-15T16:45:00Z', resultCount: 8 },
  { id: 'ss-5', name: 'Formula: C9H8O4', smiles: 'C9H8O4', options: { ...DEFAULT_SEARCH_OPTIONS, mode: 'formula' }, savedAt: '2026-04-22T08:00:00Z', resultCount: 1 },
];

type Step = 1 | 2 | 3 | 4;

function ChemicalSearchPage() {
  const [step, setStep] = useState<Step>(1);
  const [querySmiles, setQuerySmiles] = useState('');
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({ ...DEFAULT_SEARCH_OPTIONS });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedCompounds, setSelectedCompounds] = useState<ChemRegCompound[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(MOCK_SAVED_SEARCHES);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [detailCompound, setDetailCompound] = useState<ChemRegCompound | null>(null);
  const [associatedFiles, setAssociatedFiles] = useState<PlatformFile[]>([]);
  const [ketcherReady, setKetcherReady] = useState(false);
  const ketcherRef = useRef<KetcherEditorHandle>(null);

  const updateOption = useCallback(<K extends keyof SearchOptions>(key: K, value: SearchOptions[K]) => {
    setSearchOptions((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Step 1 → 2: Search ────────────────────────────────────
  const handleSearch = useCallback(async () => {
    let smiles = querySmiles.trim();

    if (ketcherReady && ketcherRef.current && searchOptions.mode !== 'formula') {
      const ketcherSmiles = await ketcherRef.current.getSmiles();
      if (ketcherSmiles && ketcherSmiles.trim()) {
        smiles = ketcherSmiles.trim();
        setQuerySmiles(smiles);
      }
    }

    if (!smiles) return;

    const results = searchCompounds(smiles, searchOptions);
    setSearchResults(results);
    setSelectedCompounds([]);
    setStep(2);
  }, [querySmiles, searchOptions, ketcherReady]);

  // ── Step 2 → 3: View compound detail ──────────────────────
  const handleViewDetail = useCallback((compound: ChemRegCompound) => {
    setDetailCompound(compound);
    setStep(3);
  }, []);

  // ── Step 2/3 → 4: Find files for selected compounds ──────
  const handleFindFiles = useCallback(() => {
    const compounds = selectedCompounds.length > 0 ? selectedCompounds : (detailCompound ? [detailCompound] : []);
    if (compounds.length === 0) return;
    // Deduplicate files across all selected compounds
    const fileMap = new Map<string, PlatformFile>();
    for (const c of compounds) {
      for (const f of getFilesForCompound(c.molId)) {
        fileMap.set(f.fileId, f);
      }
    }
    setAssociatedFiles(Array.from(fileMap.values()));
    setStep(4);
  }, [selectedCompounds, detailCompound]);

  // ── Reset ──────────────────────────────────────────────────
  const handleNewSearch = useCallback(() => {
    setStep(1);
    setSearchResults([]);
    setSelectedCompounds([]);
    setDetailCompound(null);
    setAssociatedFiles([]);
  }, []);

  // Re-search with new options (Step 2)
  const handleOptionsChange = useCallback(
    (opts: Partial<SearchOptions>) => {
      const next = { ...searchOptions, ...opts };
      setSearchOptions(next);
      if (querySmiles.trim()) {
        setSearchResults(searchCompounds(querySmiles, next));
      }
    },
    [searchOptions, querySmiles],
  );

  // ── Save search ───────────────────────────────────────────
  const handleSaveSearch = useCallback((name: string) => {
    const newSaved: SavedSearch = {
      id: `ss-${Date.now()}`,
      name,
      smiles: querySmiles,
      options: { ...searchOptions },
      savedAt: new Date().toISOString(),
      resultCount: searchResults.length,
    };
    setSavedSearches((prev) => [newSaved, ...prev]);
    setShowSaveDialog(false);
  }, [querySmiles, searchOptions, searchResults]);

  // ── Load saved search ─────────────────────────────────────
  const handleLoadSearch = useCallback((saved: SavedSearch) => {
    setQuerySmiles(saved.smiles);
    setSearchOptions(saved.options);
    // Try to set Ketcher if available
    if (ketcherRef.current && saved.options.mode !== 'formula') {
      ketcherRef.current.setSmiles(saved.smiles);
    }
  }, []);

  // Compounds to show in files step
  const filesCompounds = selectedCompounds.length > 0 ? selectedCompounds : (detailCompound ? [detailCompound] : []);

  return (
    <div className="chemsrch-page">
      {/* Header */}
      <div className="chemsrch-header">
        <Link to="/" className="chemsrch-back-link">&larr; Home</Link>
        <h1>Molecule Search</h1>
        <p className="chemsrch-subtitle">
          Search chemical registration database by structure and find associated platform data
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* Steps */}
      {step === 1 && (
        <MoleculeInputStep
          ketcherRef={ketcherRef}
          querySmiles={querySmiles}
          searchOptions={searchOptions}
          savedSearches={savedSearches}
          onSmilesChange={setQuerySmiles}
          onOptionChange={updateOption}
          onSearch={handleSearch}
          onLoadSearch={handleLoadSearch}
          onKetcherReady={() => setKetcherReady(true)}
        />
      )}

      {step === 2 && (
        <SearchResultsStep
          querySmiles={querySmiles}
          searchOptions={searchOptions}
          results={searchResults}
          selectedCompounds={selectedCompounds}
          onSelectedChange={setSelectedCompounds}
          onOptionsChange={handleOptionsChange}
          onViewDetail={handleViewDetail}
          onFindFiles={handleFindFiles}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && detailCompound && (
        <CompoundDetailStep
          compound={detailCompound}
          onFindFiles={handleFindFiles}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && filesCompounds.length > 0 && (
        <AssociatedFilesStep
          compounds={filesCompounds}
          files={associatedFiles}
          showSaveDialog={showSaveDialog}
          onShowSaveDialog={() => setShowSaveDialog(true)}
          onSaveSearch={handleSaveSearch}
          onCancelSave={() => setShowSaveDialog(false)}
          onBack={() => setStep(selectedCompounds.length > 0 ? 2 : 3)}
          onNewSearch={handleNewSearch}
        />
      )}
    </div>
  );
}

// ── Step Indicator ───────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { num: 1, label: 'Draw / Input' },
    { num: 2, label: 'Search Results' },
    { num: 3, label: 'Compound Detail' },
    { num: 4, label: 'Associated Files' },
  ];

  return (
    <div className="chemsrch-steps">
      {steps.map((s, i) => (
        <div key={s.num} className="chemsrch-step-item">
          <div className={`chemsrch-step-circle ${current >= s.num ? 'active' : ''} ${current === s.num ? 'current' : ''}`}>
            {current > s.num ? '✓' : s.num}
          </div>
          <span className={`chemsrch-step-label ${current >= s.num ? 'active' : ''}`}>
            {s.label}
          </span>
          {i < steps.length - 1 && <div className={`chemsrch-step-line ${current > s.num ? 'active' : ''}`} />}
        </div>
      ))}
    </div>
  );
}

// ── Step 1: Molecule Input ───────────────────────────────────

function MoleculeInputStep({
  ketcherRef,
  querySmiles,
  searchOptions,
  savedSearches,
  onSmilesChange,
  onOptionChange,
  onSearch,
  onLoadSearch,
  onKetcherReady,
}: {
  ketcherRef: React.RefObject<KetcherEditorHandle | null>;
  querySmiles: string;
  searchOptions: SearchOptions;
  savedSearches: SavedSearch[];
  onSmilesChange: (s: string) => void;
  onOptionChange: <K extends keyof SearchOptions>(key: K, value: SearchOptions[K]) => void;
  onSearch: () => void;
  onLoadSearch: (saved: SavedSearch) => void;
  onKetcherReady: () => void;
}) {
  const [showSaved, setShowSaved] = useState(false);

  return (
    <div className="chemsrch-input-step">
      {/* Saved searches panel */}
      <div className="chemsrch-saved-bar">
        <button className="chemsrch-saved-toggle" onClick={() => setShowSaved(!showSaved)}>
          <SavedSearchIcon />
          Saved Searches ({savedSearches.length})
          <span className="chemsrch-saved-chevron">{showSaved ? '▲' : '▼'}</span>
        </button>
      </div>

      {showSaved && (
        <div className="chemsrch-saved-panel">
          {savedSearches.length === 0 ? (
            <p className="chemsrch-saved-empty">No saved searches yet. Run a search and save it from the results page.</p>
          ) : (
            <div className="chemsrch-saved-list">
              {savedSearches.map((s) => (
                <button
                  key={s.id}
                  className="chemsrch-saved-item"
                  onClick={() => { onLoadSearch(s); setShowSaved(false); }}
                >
                  <div className="chemsrch-saved-item-main">
                    <span className="chemsrch-saved-item-name">{s.name}</span>
                    <span className={`chemsrch-match-badge ${s.options.mode}`}>{s.options.mode}</span>
                  </div>
                  <div className="chemsrch-saved-item-meta">
                    <code>{s.smiles.length > 40 ? s.smiles.slice(0, 40) + '…' : s.smiles}</code>
                    <span>{s.resultCount} results &middot; {formatDate(s.savedAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {searchOptions.mode !== 'formula' && (
        <div className="chemsrch-editor-section">
          <label className="chemsrch-label">Draw a molecule</label>
          <KetcherEditor ref={ketcherRef} height={400} onInit={onKetcherReady} />
        </div>
      )}

      <div className="chemsrch-smiles-section">
        <label className="chemsrch-label">
          {searchOptions.mode === 'formula' ? 'Enter molecular formula' : 'Or paste SMILES directly'}
        </label>
        <input
          className="chemsrch-smiles-input"
          value={querySmiles}
          onChange={(e) => onSmilesChange(e.target.value)}
          placeholder={searchOptions.mode === 'formula' ? 'e.g. C9H8O4' : 'e.g. CC(=O)OC1=CC=CC=C1C(=O)O'}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
      </div>

      <div className="chemsrch-mode-section">
        <label className="chemsrch-label">Search type</label>
        <div className="chemsrch-mode-toggle">
          {(['similarity', 'substructure', 'exact', 'formula'] as SearchMode[]).map((mode) => (
            <button
              key={mode}
              className={`chemsrch-mode-btn ${searchOptions.mode === mode ? 'active' : ''}`}
              onClick={() => onOptionChange('mode', mode)}
            >
              {mode === 'similarity' ? 'Similarity' : mode === 'substructure' ? 'Substructure' : mode === 'exact' ? 'Exact' : 'Formula'}
            </button>
          ))}
        </div>
      </div>

      {searchOptions.mode === 'similarity' && (
        <div className="chemsrch-advanced-options">
          <label className="chemsrch-label">Search parameters</label>
          <div className="chemsrch-options-grid">
            <div className="chemsrch-option">
              <span className="chemsrch-option-label">Similarity metric</span>
              <div className="chemsrch-mode-toggle small">
                {(['tanimoto', 'dice'] as SimilarityMetric[]).map((m) => (
                  <button
                    key={m}
                    className={`chemsrch-mode-btn ${searchOptions.metric === m ? 'active' : ''}`}
                    onClick={() => onOptionChange('metric', m)}
                  >
                    {m === 'tanimoto' ? 'Tanimoto' : 'Dice'}
                  </button>
                ))}
              </div>
            </div>
            <div className="chemsrch-option">
              <span className="chemsrch-option-label">
                Threshold: <strong>{(searchOptions.threshold * 100).toFixed(0)}%</strong>
              </span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={searchOptions.threshold}
                onChange={(e) => onOptionChange('threshold', parseFloat(e.target.value))}
                className="chemsrch-slider"
              />
              <div className="chemsrch-slider-labels">
                <span>10%</span><span>100%</span>
              </div>
            </div>
          </div>
          <div className="chemsrch-checkboxes">
            <label className="chemsrch-checkbox">
              <input type="checkbox" checked={searchOptions.stereoSearch} onChange={(e) => onOptionChange('stereoSearch', e.target.checked)} />
              Stereo-specific matching
            </label>
            <label className="chemsrch-checkbox">
              <input type="checkbox" checked={searchOptions.tautomerSearch} onChange={(e) => onOptionChange('tautomerSearch', e.target.checked)} />
              Tautomer search
            </label>
            <label className="chemsrch-checkbox">
              <input type="checkbox" checked={searchOptions.chargeMatch} onChange={(e) => onOptionChange('chargeMatch', e.target.checked)} />
              Charge matching
            </label>
          </div>
        </div>
      )}

      <button
        className="chemsrch-search-btn"
        onClick={onSearch}
        disabled={!querySmiles.trim()}
      >
        Search Chemical Registry
      </button>
    </div>
  );
}

// ── Step 2: Search Results ───────────────────────────────────

function SearchResultsStep({
  querySmiles,
  searchOptions,
  results,
  selectedCompounds,
  onSelectedChange,
  onOptionsChange,
  onViewDetail,
  onFindFiles,
  onBack,
}: {
  querySmiles: string;
  searchOptions: SearchOptions;
  results: SearchResult[];
  selectedCompounds: ChemRegCompound[];
  onSelectedChange: (compounds: ChemRegCompound[]) => void;
  onOptionsChange: (opts: Partial<SearchOptions>) => void;
  onViewDetail: (c: ChemRegCompound) => void;
  onFindFiles: () => void;
  onBack: () => void;
}) {
  const [sortKey, setSortKey] = useState<string>('similarity');
  const [sortAsc, setSortAsc] = useState(false);
  const selectedIds = useMemo(() => new Set(selectedCompounds.map((c) => c.molId)), [selectedCompounds]);

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  }, [sortKey]);

  const toggleSelect = useCallback((compound: ChemRegCompound) => {
    onSelectedChange(
      selectedIds.has(compound.molId)
        ? selectedCompounds.filter((c) => c.molId !== compound.molId)
        : [...selectedCompounds, compound],
    );
  }, [selectedCompounds, selectedIds, onSelectedChange]);

  const toggleSelectAll = useCallback(() => {
    if (selectedCompounds.length === results.length) {
      onSelectedChange([]);
    } else {
      onSelectedChange(results.map((r) => r.compound));
    }
  }, [results, selectedCompounds, onSelectedChange]);

  const sortedResults = useMemo(() => {
    const sorted = [...results];
    sorted.sort((a, b) => {
      let va: number, vb: number;
      switch (sortKey) {
        case 'mw': va = a.compound.mw; vb = b.compound.mw; break;
        case 'logP': va = a.compound.logP; vb = b.compound.logP; break;
        case 'tpsa': va = a.compound.tpsa; vb = b.compound.tpsa; break;
        case 'similarity': default: va = a.similarity; vb = b.similarity; break;
      }
      return sortAsc ? va - vb : vb - va;
    });
    return sorted;
  }, [results, sortKey, sortAsc]);

  const tableData = useMemo(
    () =>
      sortedResults.map((r) => ({
        _compound: r.compound,
        checkbox: (
          <input
            type="checkbox"
            className="chemsrch-row-checkbox"
            checked={selectedIds.has(r.compound.molId)}
            onChange={(e) => { e.stopPropagation(); toggleSelect(r.compound); }}
            onClick={(e) => e.stopPropagation()}
          />
        ),
        structure: <MoleculeCard smiles={r.compound.smiles} width={100} height={70} />,
        name: r.compound.name,
        molId: <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.compound.molId}</span>,
        formula: r.compound.formula,
        mw: r.compound.mw.toFixed(1),
        logP: r.compound.logP.toFixed(1),
        tpsa: r.compound.tpsa.toFixed(1),
        hba_hbd: `${r.compound.hba} / ${r.compound.hbd}`,
        similarity: (
          <div className="chemsrch-sim-cell">
            <div className="chemsrch-sim-bar">
              <div
                className="chemsrch-sim-fill"
                style={{ width: `${r.similarity * 100}%` }}
              />
            </div>
            <span>{(r.similarity * 100).toFixed(1)}%</span>
          </div>
        ),
        scores: (
          <span className="chemsrch-scores">
            T:{(r.tanimotoScore * 100).toFixed(0)} D:{(r.diceScore * 100).toFixed(0)}
          </span>
        ),
        matchType: (
          <span className={`chemsrch-match-badge ${r.matchType}`}>
            {r.matchType}
          </span>
        ),
      })),
    [sortedResults, selectedIds, toggleSelect],
  );

  const sortIndicator = (key: string) =>
    sortKey === key ? (sortAsc ? ' ▲' : ' ▼') : '';

  const columns = [
    { key: 'checkbox', header: '', width: '36px' },
    { key: 'structure', header: 'Structure', width: '110px' },
    { key: 'name', header: 'Name', width: '120px' },
    { key: 'molId', header: 'Mol ID', width: '90px' },
    { key: 'formula', header: 'Formula', width: '130px' },
    { key: 'mw', header: `MW${sortIndicator('mw')}`, width: '70px' },
    { key: 'logP', header: `LogP${sortIndicator('logP')}`, width: '60px' },
    { key: 'tpsa', header: `TPSA${sortIndicator('tpsa')}`, width: '60px' },
    { key: 'hba_hbd', header: 'HBA/HBD', width: '70px' },
    { key: 'similarity', header: `Similarity${sortIndicator('similarity')}`, width: '140px' },
    { key: 'scores', header: 'T / D', width: '70px' },
    { key: 'matchType', header: 'Match', width: '90px' },
  ];

  return (
    <div className="chemsrch-results-step">
      <div className="chemsrch-results-toolbar">
        <button className="chemsrch-text-btn" onClick={onBack}>&larr; Back to drawing</button>
        <div className="chemsrch-results-info">
          <span className="chemsrch-result-count">{results.length}</span>
          <span>results for</span>
          <code className="chemsrch-query-preview">{querySmiles.length > 30 ? querySmiles.slice(0, 30) + '…' : querySmiles}</code>
        </div>
        <div className="chemsrch-mode-toggle small">
          {(['similarity', 'substructure', 'exact', 'formula'] as SearchMode[]).map((mode) => (
            <button
              key={mode}
              className={`chemsrch-mode-btn ${searchOptions.mode === mode ? 'active' : ''}`}
              onClick={() => onOptionsChange({ mode })}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Selection bar + sort controls */}
      <div className="chemsrch-sort-bar">
        <label className="chemsrch-checkbox chemsrch-select-all">
          <input
            type="checkbox"
            checked={selectedCompounds.length === results.length && results.length > 0}
            ref={(el) => { if (el) el.indeterminate = selectedCompounds.length > 0 && selectedCompounds.length < results.length; }}
            onChange={toggleSelectAll}
          />
          {selectedCompounds.length > 0 ? `${selectedCompounds.length} selected` : 'Select all'}
        </label>
        {selectedCompounds.length > 0 && (
          <button className="chemsrch-find-selected-btn" onClick={onFindFiles}>
            Find Files for Selected ({selectedCompounds.length})
          </button>
        )}
        <div style={{ flex: 1 }} />
        <span className="chemsrch-sort-label">Sort by:</span>
        {['similarity', 'mw', 'logP', 'tpsa'].map((key) => (
          <button
            key={key}
            className={`chemsrch-sort-btn ${sortKey === key ? 'active' : ''}`}
            onClick={() => handleSort(key)}
          >
            {key === 'similarity' ? 'Similarity' : key === 'mw' ? 'MW' : key === 'logP' ? 'LogP' : 'TPSA'}
            {sortKey === key && (sortAsc ? ' ▲' : ' ▼')}
          </button>
        ))}
      </div>

      <CustomTable
        data={tableData}
        columns={columns}
        onRowClick={(row: any) => onViewDetail(row._compound)}
      />
    </div>
  );
}

// ── Step 3: Compound Detail ──────────────────────────────────

function CompoundDetailStep({
  compound,
  onFindFiles,
  onBack,
}: {
  compound: ChemRegCompound;
  onFindFiles: () => void;
  onBack: () => void;
}) {
  const lipinski = lipinskiRuleOfFive(compound);

  return (
    <div className="chemsrch-detail-step">
      <div className="chemsrch-detail-topbar">
        <button className="chemsrch-text-btn" onClick={onBack}>&larr; Back to results</button>
      </div>

      <div className="chemsrch-detail-layout">
        <div className="chemsrch-detail-structure">
          <MoleculeCard smiles={compound.smiles} width={280} height={200} name={compound.name} showSmiles />
        </div>

        <div className="chemsrch-detail-properties">
          <h2>{compound.name}</h2>

          <div className="chemsrch-prop-grid">
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">Mol ID</span>
              <span className="chemsrch-prop-value mono">{compound.molId}</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">Formula</span>
              <span className="chemsrch-prop-value">{compound.formula}</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">Molecular Weight</span>
              <span className="chemsrch-prop-value">{compound.mw.toFixed(1)} Da</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">CAS Number</span>
              <span className="chemsrch-prop-value mono">{compound.casNumber}</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">Registered</span>
              <span className="chemsrch-prop-value">{formatDate(compound.registrationDate)}</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">Registered By</span>
              <span className="chemsrch-prop-value">{compound.registeredBy}</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">Project</span>
              <span className="chemsrch-prop-value">{compound.project}</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">Stereocenters</span>
              <span className="chemsrch-prop-value">{compound.stereocenters}</span>
            </div>
          </div>

          <h3 className="chemsrch-section-title">Drug-Likeness Properties</h3>
          <div className="chemsrch-prop-grid">
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">LogP</span>
              <span className="chemsrch-prop-value">{compound.logP.toFixed(1)}</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">TPSA</span>
              <span className="chemsrch-prop-value">{compound.tpsa.toFixed(1)} &#8491;&sup2;</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">H-Bond Acceptors</span>
              <span className="chemsrch-prop-value">{compound.hba}</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">H-Bond Donors</span>
              <span className="chemsrch-prop-value">{compound.hbd}</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">Rotatable Bonds</span>
              <span className="chemsrch-prop-value">{compound.rotatableBonds}</span>
            </div>
            <div className="chemsrch-prop">
              <span className="chemsrch-prop-label">Ring Count</span>
              <span className="chemsrch-prop-value">{compound.ringCount}</span>
            </div>
          </div>

          <div className={`chemsrch-lipinski ${lipinski.pass ? 'pass' : 'fail'}`}>
            <div className="chemsrch-lipinski-header">
              <span className="chemsrch-lipinski-icon">{lipinski.pass ? '✓' : '✗'}</span>
              <strong>Lipinski Rule of 5</strong>
              <span className="chemsrch-lipinski-status">
                {lipinski.pass ? 'PASS' : 'FAIL'} ({lipinski.violations} violation{lipinski.violations !== 1 ? 's' : ''})
              </span>
            </div>
            <div className="chemsrch-lipinski-rules">
              {lipinski.details.map((d) => (
                <span key={d.rule} className={`chemsrch-lipinski-rule ${d.pass ? 'pass' : 'fail'}`}>
                  {d.rule}: {typeof d.value === 'number' ? d.value.toFixed(1) : d.value}
                </span>
              ))}
            </div>
          </div>

          <button className="chemsrch-find-files-btn" onClick={onFindFiles}>
            Find Associated Data Files
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Associated Files ─────────────────────────────────

function AssociatedFilesStep({
  compounds,
  files,
  showSaveDialog,
  onShowSaveDialog,
  onSaveSearch,
  onCancelSave,
  onBack,
  onNewSearch,
}: {
  compounds: ChemRegCompound[];
  files: PlatformFile[];
  showSaveDialog: boolean;
  onShowSaveDialog: () => void;
  onSaveSearch: (name: string) => void;
  onCancelSave: () => void;
  onBack: () => void;
  onNewSearch: () => void;
}) {
  const [saveName, setSaveName] = useState('');
  const [selectedFile, setSelectedFile] = useState<PlatformFile | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const tableData = useMemo(
    () =>
      files.map((f) => ({
        _file: f,
        fileName: (
          <span className="chemsrch-filename" title={f.filePath}>
            {f.fileName}
          </span>
        ),
        fileType: (
          <span
            className="chemsrch-filetype-badge"
            style={{ background: fileTypeColor(f.fileType) }}
          >
            {f.fileType}
          </span>
        ),
        linkedCompounds: (
          <span className="chemsrch-linked-mols">
            {f.molIds.join(', ')}
          </span>
        ),
        source: f.source,
        size: formatFileSize(f.size),
        created: formatDate(f.createdAt),
        actions: (
          <div className="actions-cell">
            <button
              className="action-icon-btn"
              onClick={(e) => { e.stopPropagation(); toggleBookmark(f.fileId); }}
              aria-label="Bookmark"
              data-tooltip="Bookmark"
            >
              <BookmarkIcon filled={bookmarked.has(f.fileId)} />
            </button>
            <button
              className="action-icon-btn"
              onClick={(e) => { e.stopPropagation(); console.log('Download', f.fileName); }}
              aria-label="Download"
              data-tooltip="Download"
            >
              <DownloadIcon />
            </button>
            <button
              className="action-icon-btn"
              onClick={(e) => { e.stopPropagation(); setSelectedFile(f); }}
              aria-label="About"
              data-tooltip="About"
            >
              <FileInfoIcon />
            </button>
            <div className="action-menu-wrapper">
              <button
                className="action-icon-btn"
                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === f.fileId ? null : f.fileId); }}
                aria-label="More actions"
                data-tooltip="More actions"
              >
                <MoreIcon />
              </button>
              {openMenuId === f.fileId && (
                <div className="action-menu">
                  <button className="action-menu-item" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}>
                    <ShareIcon /><span>Share</span>
                  </button>
                  <button className="action-menu-item" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}>
                    <LineageIcon /><span>Lineage</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ),
      })),
    [files, bookmarked, openMenuId],
  );

  const columns = [
    { key: 'fileName', header: 'File Name', width: '25%' },
    { key: 'fileType', header: 'Type', width: '80px' },
    { key: 'linkedCompounds', header: 'Compounds', width: '120px' },
    { key: 'source', header: 'Source', width: '16%' },
    { key: 'size', header: 'Size', width: '80px' },
    { key: 'created', header: 'Created', width: '120px' },
    { key: 'actions', header: '', width: '140px' },
  ];

  return (
    <div className="chemsrch-files-step">
      <div className="chemsrch-files-toolbar">
        <button className="chemsrch-text-btn" onClick={onBack}>&larr; Back</button>
        <button className="chemsrch-text-btn" onClick={onNewSearch}>New search</button>
        <div style={{ flex: 1 }} />
        <button className="chemsrch-save-btn" onClick={onShowSaveDialog}>
          <SavedSearchIcon /> Save Search
        </button>
      </div>

      {showSaveDialog && (
        <div className="chemsrch-save-dialog">
          <label className="chemsrch-label">Save this search</label>
          <div className="chemsrch-save-dialog-row">
            <input
              className="chemsrch-smiles-input"
              placeholder="Search name, e.g. 'Kinase scaffold similarity'"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && saveName.trim()) onSaveSearch(saveName.trim()); }}
              autoFocus
            />
            <button
              className="chemsrch-save-confirm-btn"
              disabled={!saveName.trim()}
              onClick={() => { onSaveSearch(saveName.trim()); setSaveName(''); }}
            >
              Save
            </button>
            <button className="chemsrch-text-btn" onClick={onCancelSave}>Cancel</button>
          </div>
        </div>
      )}

      <div className="chemsrch-files-banner">
        <div className="chemsrch-files-compounds">
          {compounds.map((c) => (
            <div key={c.molId} className="chemsrch-files-compound-chip">
              <MoleculeCard smiles={c.smiles} width={48} height={36} />
              <span>{c.name} <small>({c.molId})</small></span>
            </div>
          ))}
        </div>
        <span className="chemsrch-files-count">
          {files.length} file{files.length !== 1 ? 's' : ''} found
          {compounds.length > 1 ? ` across ${compounds.length} compounds` : ''}
        </span>
      </div>

      {files.length === 0 ? (
        <div className="chemsrch-no-files">
          <p>No platform files found for the selected compound{compounds.length > 1 ? 's' : ''}.</p>
        </div>
      ) : (
        <CustomTable
          data={tableData}
          columns={columns}
          onRowClick={(row: any) => setSelectedFile(row._file)}
        />
      )}

      {selectedFile && (
        <FileDetailDrawer
          file={selectedFile}
          compounds={compounds}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}

// ── Saved search icon ────────────────────────────────────

const SavedSearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

// ── Action Icons (matching SearchResultsPage style) ──────

const BookmarkIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const FileInfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
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
    <path d="M6 21V9a9 9 0 0 0 9 9"></path>
  </svg>
);

// ── File Detail Drawer ───────────────────────────────────────

function FileDetailDrawer({
  file,
  compounds,
  onClose,
}: {
  file: PlatformFile;
  compounds: ChemRegCompound[];
  onClose: () => void;
}) {
  const primaryCompound = compounds[0];

  return (
    <div className="chemsrch-drawer-overlay" onClick={onClose}>
      <div className="chemsrch-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="chemsrch-drawer-header">
          <h2>File Details</h2>
          <button className="chemsrch-drawer-close" onClick={onClose}>&times;</button>
        </div>

        <div className="chemsrch-drawer-body">
          <div className="chemsrch-drawer-section">
            <span
              className="chemsrch-filetype-badge"
              style={{ background: fileTypeColor(file.fileType), marginBottom: 8, display: 'inline-block' }}
            >
              {file.fileType}
            </span>
            <h3 className="chemsrch-drawer-filename">{file.fileName}</h3>
            <div className="chemsrch-drawer-path">{file.filePath}</div>
          </div>

          <div className="chemsrch-drawer-grid">
            <div className="chemsrch-drawer-item">
              <span className="chemsrch-drawer-label">Size</span>
              <span className="chemsrch-drawer-value">{formatFileSize(file.size)}</span>
            </div>
            <div className="chemsrch-drawer-item">
              <span className="chemsrch-drawer-label">Created</span>
              <span className="chemsrch-drawer-value">{formatDate(file.createdAt)}</span>
            </div>
            <div className="chemsrch-drawer-item">
              <span className="chemsrch-drawer-label">Source</span>
              <span className="chemsrch-drawer-value">{file.source}</span>
            </div>
            <div className="chemsrch-drawer-item">
              <span className="chemsrch-drawer-label">File ID</span>
              <span className="chemsrch-drawer-value mono">{file.fileId}</span>
            </div>
          </div>

          <div className="chemsrch-drawer-section">
            <h4>Linked Compound</h4>
            <div className="chemsrch-drawer-compound">
              <MoleculeCard smiles={primaryCompound.smiles} width={120} height={80} />
              <div>
                <strong>{primaryCompound.name}</strong>
                <div className="chemsrch-drawer-meta">{primaryCompound.molId} &middot; {primaryCompound.formula} &middot; {primaryCompound.mw.toFixed(1)} Da</div>
              </div>
            </div>
          </div>

          {file.molIds.length > 1 && (
            <div className="chemsrch-drawer-section">
              <h4>All Linked Compounds</h4>
              <div className="chemsrch-drawer-tags">
                {file.molIds.map((id) => (
                  <span key={id} className="chemsrch-drawer-tag">{id}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChemicalSearchPage;
