import { useEffect, useRef, useState, useCallback } from 'react';
import './MoleculeCard.css';

interface Props {
  smiles: string;
  width?: number;
  height?: number;
  name?: string;
  showSmiles?: boolean;
  expandable?: boolean;
}

function MoleculeCard({ smiles, width = 160, height = 120, name, showSmiles, expandable = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      try {
        const mod = await import('smiles-drawer');
        if (cancelled || !containerRef.current) return;

        const SmiDrawer = (mod as any).SmiDrawer || (mod as any).default?.SmiDrawer || (mod as any).default?.default?.SmiDrawer;
        if (!SmiDrawer) {
          setError(true);
          return;
        }

        containerRef.current.innerHTML = '';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', String(width));
        svg.setAttribute('height', String(height));
        svg.style.display = 'block';
        containerRef.current.appendChild(svg);

        const drawer = new SmiDrawer({ width, height });
        drawer.draw(smiles, svg, 'light', () => {
          if (!cancelled) setError(false);
        }, () => {
          if (!cancelled) setError(true);
        });
      } catch {
        if (!cancelled) setError(true);
      }
    }

    draw();
    return () => { cancelled = true; };
  }, [smiles, width, height]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!expandable || error) return;
    e.stopPropagation();
    setExpanded(true);
  }, [expandable, error]);

  return (
    <>
      <div className={`mol-card ${expandable && !error ? 'mol-card-expandable' : ''}`} style={{ width }} onClick={handleClick}>
        {error ? (
          <div className="mol-card-fallback" style={{ width, height }}>?</div>
        ) : (
          <>
            <div ref={containerRef} className="mol-card-svg" style={{ width, height }} />
            {expandable && !error && <div className="mol-card-expand-hint">Click to expand</div>}
          </>
        )}
        {name && <div className="mol-card-name" title={name}>{name}</div>}
        {showSmiles && (
          <div className="mol-card-smiles" title={smiles}>{smiles}</div>
        )}
      </div>

      {expanded && (
        <MoleculeModal smiles={smiles} name={name} onClose={() => setExpanded(false)} />
      )}
    </>
  );
}

function MoleculeModal({ smiles, name, onClose }: { smiles: string; name?: string; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modalW = 520;
  const modalH = 400;

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      try {
        const mod = await import('smiles-drawer');
        if (cancelled || !containerRef.current) return;

        const SmiDrawer = (mod as any).SmiDrawer || (mod as any).default?.SmiDrawer || (mod as any).default?.default?.SmiDrawer;
        if (!SmiDrawer) return;

        containerRef.current.innerHTML = '';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', String(modalW));
        svg.setAttribute('height', String(modalH));
        svg.style.display = 'block';
        containerRef.current.appendChild(svg);

        const drawer = new SmiDrawer({ width: modalW, height: modalH });
        drawer.draw(smiles, svg, 'light');
      } catch {
        // ignore
      }
    }

    draw();

    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => { cancelled = true; window.removeEventListener('keydown', handleEsc); };
  }, [smiles, onClose]);

  return (
    <div className="mol-modal-overlay" onClick={onClose}>
      <div className="mol-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mol-modal-header">
          <span className="mol-modal-title">{name || 'Structure'}</span>
          <button className="mol-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div ref={containerRef} className="mol-modal-body" />
        <div className="mol-modal-smiles">
          <code>{smiles}</code>
        </div>
      </div>
    </div>
  );
}

export default MoleculeCard;
