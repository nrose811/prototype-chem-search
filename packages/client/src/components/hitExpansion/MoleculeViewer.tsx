import { useEffect, useRef, useState } from 'react';

interface Props {
  smiles: string;
  width?: number;
  height?: number;
}

function MoleculeViewer({ smiles, width = 160, height = 120 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      try {
        const SmilesDrawer = await import('smiles-drawer');
        if (cancelled || !canvasRef.current) return;

        const drawer = new SmilesDrawer.SmiDrawer({ width, height });
        drawer.draw(smiles, canvasRef.current, 'light');
        setError(false);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    draw();
    return () => { cancelled = true; };
  }, [smiles, width, height]);

  if (error) {
    return (
      <div
        style={{
          width, height,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#f8f9fa', borderRadius: 4, color: '#868e96', fontSize: 24,
        }}
      >
        ?
      </div>
    );
  }

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default MoleculeViewer;
