import { useMemo, useState, useCallback } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import type { LibraryMolecule } from '../../data/moleculeLibrary';
import type { GeneratedMolecule } from '../../lib/hitExpansion/generationEngine';

interface AnchorPoint {
  id: string;
  name: string;
  umap_x: number;
  umap_y: number;
}

interface Props {
  library: LibraryMolecule[];
  generated: GeneratedMolecule[];
  anchors: AnchorPoint[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function ChemicalSpaceMap({ library, generated, anchors, selectedId, onSelect }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const libData = useMemo(
    () => library.map((m) => ({ ...m, _layer: 'library' as const })),
    [library],
  );
  const genData = useMemo(
    () => generated.map((m) => ({ ...m, _layer: 'generated' as const })),
    [generated],
  );
  const anchorData = useMemo(
    () => anchors.map((a) => ({ ...a, _layer: 'anchor' as const })),
    [anchors],
  );

  const handleGenClick = useCallback(
    (data: { id: string }) => {
      onSelect(data.id === selectedId ? null : data.id);
    },
    [onSelect, selectedId],
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div style={{
        background: '#fff', border: '1px solid #dee2e6', borderRadius: 8,
        padding: '8px 12px', fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ fontWeight: 600 }}>{d.name ?? d.id}</div>
        {d.simA !== undefined && (
          <div style={{ color: '#6c757d' }}>
            Sim(A): {d.simA.toFixed(3)} | Sim(B): {d.simB.toFixed(3)}
          </div>
        )}
        <div style={{ color: '#868e96' }}>
          MW: {d.mw} | LogP: {d.logp}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 300 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <XAxis type="number" dataKey="umap_x" name="UMAP-1" tick={{ fontSize: 10 }} />
          <YAxis type="number" dataKey="umap_y" name="UMAP-2" tick={{ fontSize: 10 }} />
          <ZAxis range={[20, 60]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Library (background) */}
          <Scatter name="Library" data={libData} fill="#adb5bd" fillOpacity={0.4}>
            {libData.map((_, i) => (
              <Cell key={i} r={3} />
            ))}
          </Scatter>

          {/* Generated molecules */}
          <Scatter
            name="Generated"
            data={genData}
            fill="#3498db"
            onClick={(data: any) => handleGenClick(data)}
            cursor="pointer"
          >
            {genData.map((m) => (
              <Cell
                key={m.id}
                r={m.id === selectedId ? 7 : 5}
                fill={m.id === selectedId ? '#2563eb' : '#3498db'}
                stroke={m.id === selectedId ? '#fff' : 'none'}
                strokeWidth={m.id === selectedId ? 2 : 0}
              />
            ))}
          </Scatter>

          {/* Anchors */}
          <Scatter name="Anchors" data={anchorData} fill="#f59e0b">
            {anchorData.map((_, i) => (
              <Cell key={i} r={7} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChemicalSpaceMap;
