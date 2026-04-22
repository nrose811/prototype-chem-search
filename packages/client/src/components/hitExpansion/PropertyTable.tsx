import { useState, useMemo, useCallback } from 'react';
import type { GeneratedMolecule } from '../../lib/hitExpansion/generationEngine';
import { enrichProperties } from '../../lib/hitExpansion/properties';
import MoleculeViewer from './MoleculeViewer';
import './PropertyTable.css';

interface Props {
  molecules: GeneratedMolecule[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  cartIds: Set<string>;
  onToggleCart: (mol: GeneratedMolecule) => void;
}

type SortKey = 'id' | 'simA' | 'simB' | 'score' | 'mw' | 'logp' | 'hbd' | 'hba'
  | 'psa' | 'saScore' | 'mpoScore' | 'lipE' | 'heavyAtoms' | 'rotatableBonds';

function PropertyTable({ molecules, selectedId, onSelect, cartIds, onToggleCart }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('simA');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showExtended, setShowExtended] = useState(false);

  const enriched = useMemo(
    () =>
      molecules.map((m) => ({
        ...m,
        props: enrichProperties(m.id, m.mw, m.logp, m.hbd, m.hba, m.simA),
      })),
    [molecules],
  );

  const sorted = useMemo(() => {
    return [...enriched].sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === 'id') {
        return sortDir === 'asc'
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id);
      }
      if (sortKey in a.props) {
        va = (a.props as unknown as Record<string, number>)[sortKey];
        vb = (b.props as unknown as Record<string, number>)[sortKey];
      } else {
        va = (a as unknown as Record<string, number>)[sortKey] ?? 0;
        vb = (b as unknown as Record<string, number>)[sortKey] ?? 0;
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  }, [enriched, sortKey, sortDir]);

  const toggleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('desc');
      }
    },
    [sortKey],
  );

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th className="he-th sortable" onClick={() => toggleSort(k)}>
      {label}
      {sortKey === k && <span className="he-sort-arrow">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>}
    </th>
  );

  return (
    <div className="he-table-wrapper">
      <div className="he-table-toolbar">
        <span className="he-table-count">{molecules.length} molecules</span>
        <button
          className="he-toggle-cols-btn"
          onClick={() => setShowExtended(!showExtended)}
        >
          {showExtended ? 'Hide Extended' : 'Show Extended'}
        </button>
      </div>

      <div className="he-table-scroll">
        <table className="he-table">
          <thead>
            <tr>
              <SortHeader label="ID" k="id" />
              <th className="he-th">Structure</th>
              <SortHeader label="Sim(A)" k="simA" />
              <SortHeader label="Sim(B)" k="simB" />
              <SortHeader label="Score" k="score" />
              <SortHeader label="MW" k="mw" />
              <SortHeader label="LogP" k="logp" />
              <SortHeader label="HBD" k="hbd" />
              <SortHeader label="HBA" k="hba" />
              {showExtended && (
                <>
                  <SortHeader label="PSA" k="psa" />
                  <SortHeader label="SA Score" k="saScore" />
                  <SortHeader label="MPO" k="mpoScore" />
                  <SortHeader label="LipE" k="lipE" />
                  <SortHeader label="Heavy" k="heavyAtoms" />
                  <SortHeader label="Rot. Bonds" k="rotatableBonds" />
                </>
              )}
              <th className="he-th">Cart</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => (
              <tr
                key={m.id}
                className={`he-row ${m.id === selectedId ? 'selected' : ''}`}
                onClick={() => onSelect(m.id === selectedId ? null : m.id)}
              >
                <td className="he-td he-mono">{m.id}</td>
                <td className="he-td">
                  <MoleculeViewer smiles={m.smiles} width={80} height={50} />
                </td>
                <td className="he-td he-num">{m.simA.toFixed(3)}</td>
                <td className="he-td he-num">{m.simB.toFixed(3)}</td>
                <td className="he-td he-num">{m.score.toFixed(3)}</td>
                <td className="he-td he-num">{m.mw.toFixed(1)}</td>
                <td className="he-td he-num">{m.logp.toFixed(1)}</td>
                <td className="he-td he-num">{m.hbd}</td>
                <td className="he-td he-num">{m.hba}</td>
                {showExtended && (
                  <>
                    <td className="he-td he-num">{m.props.psa}</td>
                    <td className="he-td he-num">{m.props.saScore.toFixed(2)}</td>
                    <td className="he-td he-num">{m.props.mpoScore.toFixed(2)}</td>
                    <td className="he-td he-num">{m.props.lipE.toFixed(1)}</td>
                    <td className="he-td he-num">{m.props.heavyAtoms}</td>
                    <td className="he-td he-num">{m.props.rotatableBonds}</td>
                  </>
                )}
                <td className="he-td">
                  <button
                    className={`he-cart-btn ${cartIds.has(m.id) ? 'in-cart' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onToggleCart(m); }}
                  >
                    {cartIds.has(m.id) ? '✓' : '+'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PropertyTable;
