import { useEffect, useRef, useState } from 'react';
import './MoleculeCard.css';

interface Props {
  smiles: string;
  width?: number;
  height?: number;
  name?: string;
  showSmiles?: boolean;
}

function MoleculeCard({ smiles, width = 160, height = 120, name, showSmiles }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      try {
        const mod = await import('smiles-drawer');
        if (cancelled || !containerRef.current) return;

        // smiles-drawer exports { default: namespace } where namespace.SmiDrawer is the class
        const SmiDrawer = (mod as any).SmiDrawer || (mod as any).default?.SmiDrawer || (mod as any).default?.default?.SmiDrawer;
        if (!SmiDrawer) {
          setError(true);
          return;
        }

        // Clear previous render
        containerRef.current.innerHTML = '';

        // Create SVG target
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

  return (
    <div className="mol-card" style={{ width }}>
      {error ? (
        <div className="mol-card-fallback" style={{ width, height }}>?</div>
      ) : (
        <div ref={containerRef} className="mol-card-svg" style={{ width, height }} />
      )}
      {name && <div className="mol-card-name" title={name}>{name}</div>}
      {showSmiles && (
        <div className="mol-card-smiles" title={smiles}>{smiles}</div>
      )}
    </div>
  );
}

export default MoleculeCard;
