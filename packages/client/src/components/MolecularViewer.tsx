import {useEffect, useRef, useState} from 'react';
import type {ChartType} from '../types/visualizations';
import './PlotlyChart.css';

export interface MolecularViewerProps {
	chartType: ChartType;
	title?: string;
	className?: string;
}

const MolecularViewer = ({chartType, title, className}: MolecularViewerProps) => {
	console.log('MolecularViewer: Component rendering, chartType:', chartType);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load3Dmol = async () => {
			try {
				console.log('MolecularViewer: Starting load3Dmol, chartType:', chartType);
				setIsLoading(true);
				setError(null);

				// Wait for the ref to be ready
				await new Promise(resolve => setTimeout(resolve, 0));

				if (!containerRef.current) {
					console.log('MolecularViewer: containerRef.current is null after timeout, setting loading to false');
					setIsLoading(false);
					return;
				}

				console.log('MolecularViewer: containerRef is ready, importing 3Dmol');
				// Dynamically import 3Dmol - it exports named functions
				const {createViewer} = await import('3dmol');
				console.log('MolecularViewer: 3Dmol imported successfully');

				// Create viewer
				const viewer = createViewer(containerRef.current, {
					backgroundColor: 'white',
				});

				// Mock PDB data for demonstration (simple molecule)
				const pdbData = getMockPDBData();

				// Add model
				viewer.addModel(pdbData, 'pdb');

				// Set style based on chart type
				viewer.setStyle({}, {stick: {}, sphere: {scale: 0.3}});

				// Zoom to fit
				viewer.zoomTo();

				// Render
				viewer.render();

				setIsLoading(false);
			} catch (err) {
				console.error('Error loading 3Dmol:', err);
				console.error('Error details:', err instanceof Error ? err.message : String(err));
				setError(`Failed to load 3D molecular viewer: ${err instanceof Error ? err.message : String(err)}`);
				setIsLoading(false);
			}
		};

		load3Dmol();
	}, [chartType]);

	return (
		<div className={`plotly-chart-container ${className || ''}`}>
			{title && <h3 className="chart-title">{title}</h3>}
			{isLoading && <div className="chart-loading">Loading 3D molecular viewer...</div>}
			{error && <div className="chart-error">{error}</div>}
			<div ref={containerRef} style={{width: '100%', height: '100%', minHeight: '500px', position: 'relative', display: isLoading || error ? 'none' : 'block'}} />
		</div>
	);
};

// Mock PDB data for a simple molecule (caffeine)
const getMockPDBData = (): string => {
	return `COMPND    CAFFEINE
HETATM    1  C1  CAF     1       1.180   0.568   0.447  1.00  0.00           C
HETATM    2  C2  CAF     1       0.015   1.288   0.447  1.00  0.00           C
HETATM    3  C3  CAF     1      -1.165   0.568   0.447  1.00  0.00           C
HETATM    4  C4  CAF     1      -1.165  -0.832   0.447  1.00  0.00           C
HETATM    5  C5  CAF     1       0.015  -1.552   0.447  1.00  0.00           C
HETATM    6  C6  CAF     1       1.180  -0.832   0.447  1.00  0.00           C
HETATM    7  N1  CAF     1       2.345   1.288   0.447  1.00  0.00           N
HETATM    8  N2  CAF     1       0.015   2.688   0.447  1.00  0.00           N
HETATM    9  O1  CAF     1      -2.330   1.288   0.447  1.00  0.00           O
HETATM   10  H1  CAF     1      -2.330  -1.552   0.447  1.00  0.00           H
HETATM   11  H2  CAF     1       0.015  -2.632   0.447  1.00  0.00           H
HETATM   12  H3  CAF     1       2.345  -1.552   0.447  1.00  0.00           H
CONECT    1    2    6    7
CONECT    2    1    3    8
CONECT    3    2    4    9
CONECT    4    3    5   10
CONECT    5    4    6   11
CONECT    6    1    5   12
CONECT    7    1
CONECT    8    2
CONECT    9    3
CONECT   10    4
CONECT   11    5
CONECT   12    6
END`;
};

export default MolecularViewer;

