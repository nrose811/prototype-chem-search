import {useEffect, useRef, useState} from 'react';
import type {ChartType} from '../types/visualizations';
import './PlotlyChart.css';

export interface ChemicalStructureViewerProps {
	chartType: ChartType;
	title?: string;
	className?: string;
}

const ChemicalStructureViewer = ({chartType, title, className}: ChemicalStructureViewerProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadRDKit = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Wait for the ref to be ready
				await new Promise(resolve => setTimeout(resolve, 0));

				if (!containerRef.current) {
					setIsLoading(false);
					return;
				}

				// For visualizations that don't need RDKit, render directly
				if (chartType === 'chemical-space' || chartType === 'structure-activity-heatmap' || chartType === 'similarity-network') {
					switch (chartType) {
						case 'chemical-space':
							renderChemicalSpace(containerRef.current);
							break;
						case 'structure-activity-heatmap':
							renderSARHeatmap(containerRef.current);
							break;
						case 'similarity-network':
							renderSimilarityNetwork(containerRef.current);
							break;
					}
					setIsLoading(false);
					return;
				}

				// Try to load RDKit for structure-based visualizations
				try {
					await import('@rdkit/rdkit');
					const RDKit = await (window as any).initRDKitModule();

					// Generate mock SMILES based on chart type
					const smiles = getMockSMILES(chartType);

					// Render based on chart type
					switch (chartType) {
						case 'structure-2d':
							render2DStructure(RDKit, smiles, containerRef.current);
							break;
						case 'reaction-scheme':
							renderReactionScheme(RDKit, containerRef.current);
							break;
						case 'matched-pairs':
							renderMatchedPairs(RDKit, containerRef.current);
							break;
						default:
							render2DStructure(RDKit, smiles, containerRef.current);
					}
				} catch (rdkitErr) {
					console.warn('RDKit not available, showing placeholder:', rdkitErr);
					// Show a nice placeholder instead of error
					renderRDKitPlaceholder(chartType, containerRef.current);
				}

				setIsLoading(false);
			} catch (err) {
				console.error('Error in ChemicalStructureViewer:', err);
				setError('Failed to load chemical structure viewer');
				setIsLoading(false);
			}
		};

		loadRDKit();
	}, [chartType]);

	return (
		<div className={`plotly-chart-container ${className || ''}`}>
			{title && <h3 className="chart-title">{title}</h3>}
			{isLoading && <div className="chart-loading">Loading chemical structure viewer...</div>}
			{error && <div className="chart-error">{error}</div>}
			<div ref={containerRef} style={{width: '100%', height: '100%', minHeight: '500px', display: isLoading || error ? 'none' : 'block'}} />
		</div>
	);
};

// Helper functions
const getMockSMILES = (chartType: ChartType): string => {
	// Return different SMILES for different chart types
	const smilesExamples = [
		'CC(C)Cc1ccc(cc1)C(C)C(O)=O', // Ibuprofen
		'CC(=O)Oc1ccccc1C(=O)O', // Aspirin
		'CN1C=NC2=C1C(=O)N(C(=O)N2C)C', // Caffeine
	];
	return smilesExamples[0];
};

const renderRDKitPlaceholder = (chartType: ChartType, container: HTMLElement) => {
	const placeholders: Record<string, {title: string; description: string}> = {
		'structure-2d': {
			title: '2D Chemical Structure',
			description: 'Molecular structure diagram with atoms, bonds, and stereochemistry',
		},
		'reaction-scheme': {
			title: 'Reaction Scheme',
			description: 'Multi-step chemical reaction with reactants, products, and conditions',
		},
		'matched-pairs': {
			title: 'Matched Molecular Pairs',
			description: 'Side-by-side structure comparison with property changes',
		},
	};

	const info = placeholders[chartType] || {
		title: 'Chemical Structure',
		description: 'Chemical structure visualization',
	};

	container.innerHTML = `
		<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
			<div style="text-align: center; padding: 40px;">
				<div style="font-size: 64px; margin-bottom: 16px;">🧪</div>
				<h2 style="margin: 0 0 16px 0; font-size: 24px;">${info.title}</h2>
				<p style="margin: 0 0 24px 0; font-size: 14px; opacity: 0.9; max-width: 500px;">${info.description}</p>
				<div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 4px; font-size: 12px;">
					<p style="margin: 0;">RDKit.js library not available</p>
					<p style="margin: 8px 0 0 0; opacity: 0.8;">Chemical structure rendering requires WebAssembly support</p>
				</div>
			</div>
		</div>
	`;
};

const render2DStructure = (RDKit: any, smiles: string, container: HTMLElement) => {
	try {
		const mol = RDKit.get_mol(smiles);
		const svg = mol.get_svg();
		container.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100%;">${svg}</div>`;
		mol.delete();
	} catch (err) {
		container.innerHTML = '<div style="padding: 20px;">Error rendering structure</div>';
	}
};

const renderReactionScheme = (RDKit: any, container: HTMLElement) => {
	try {
		// Example reaction: Esterification
		const reactant1 = RDKit.get_mol('CC(=O)O'); // Acetic acid
		const reactant2 = RDKit.get_mol('CCO'); // Ethanol
		const product = RDKit.get_mol('CC(=O)OCC'); // Ethyl acetate

		const svg1 = reactant1.get_svg();
		const svg2 = reactant2.get_svg();
		const svg3 = product.get_svg();

		container.innerHTML = `
			<div style="padding: 20px;">
				<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Esterification Reaction</h4>
				<div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
					<div style="flex: 1; text-align: center;">
						<div style="margin-bottom: 10px;">${svg1}</div>
						<p style="font-size: 12px; color: #666;">Acetic Acid</p>
					</div>
					<div style="font-size: 24px; color: #666;">+</div>
					<div style="flex: 1; text-align: center;">
						<div style="margin-bottom: 10px;">${svg2}</div>
						<p style="font-size: 12px; color: #666;">Ethanol</p>
					</div>
					<div style="font-size: 24px; color: #666;">→</div>
					<div style="flex: 1; text-align: center;">
						<div style="margin-bottom: 10px;">${svg3}</div>
						<p style="font-size: 12px; color: #666;">Ethyl Acetate</p>
					</div>
				</div>
				<div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
					<p style="font-size: 12px; color: #666; margin: 0;">
						<strong>Conditions:</strong> H₂SO₄ catalyst, Heat
					</p>
				</div>
			</div>
		`;

		reactant1.delete();
		reactant2.delete();
		product.delete();
	} catch (err) {
		container.innerHTML = '<div style="padding: 20px;">Error rendering reaction scheme</div>';
	}
};

const renderChemicalSpace = (container: HTMLElement) => {
	// Generate mock chemical space data
	const compounds = [
		{x: 2.5, y: 3.2, name: 'Compound A', activity: 'high', color: '#e74c3c'},
		{x: 2.8, y: 3.5, name: 'Compound B', activity: 'high', color: '#e74c3c'},
		{x: 5.1, y: 2.8, name: 'Compound C', activity: 'medium', color: '#f39c12'},
		{x: 5.3, y: 3.1, name: 'Compound D', activity: 'medium', color: '#f39c12'},
		{x: 7.8, y: 6.2, name: 'Compound E', activity: 'low', color: '#95a5a6'},
		{x: 8.1, y: 6.5, name: 'Compound F', activity: 'low', color: '#95a5a6'},
		{x: 3.2, y: 7.5, name: 'Compound G', activity: 'high', color: '#e74c3c'},
		{x: 6.5, y: 4.8, name: 'Compound H', activity: 'medium', color: '#f39c12'},
	];

	const svgWidth = 600;
	const svgHeight = 400;
	const padding = 40;

	const circles = compounds.map(c => {
		const cx = padding + (c.x / 10) * (svgWidth - 2 * padding);
		const cy = svgHeight - padding - (c.y / 10) * (svgHeight - 2 * padding);
		return `<circle cx="${cx}" cy="${cy}" r="8" fill="${c.color}" opacity="0.7" stroke="#fff" stroke-width="2">
			<title>${c.name} (${c.activity} activity)</title>
		</circle>`;
	}).join('');

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Chemical Space Map (t-SNE)</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="${svgWidth}" height="${svgHeight}" style="border: 1px solid #ddd; border-radius: 4px; background: #fafafa;">
					<!-- Axes -->
					<line x1="${padding}" y1="${svgHeight - padding}" x2="${svgWidth - padding}" y2="${svgHeight - padding}" stroke="#999" stroke-width="2"/>
					<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${svgHeight - padding}" stroke="#999" stroke-width="2"/>

					<!-- Axis labels -->
					<text x="${svgWidth / 2}" y="${svgHeight - 10}" text-anchor="middle" font-size="12" fill="#666">t-SNE Component 1</text>
					<text x="15" y="${svgHeight / 2}" text-anchor="middle" font-size="12" fill="#666" transform="rotate(-90, 15, ${svgHeight / 2})">t-SNE Component 2</text>

					<!-- Data points -->
					${circles}
				</svg>
			</div>
			<div style="margin-top: 20px; display: flex; justify-content: center; gap: 20px;">
				<div style="display: flex; align-items: center; gap: 5px;">
					<div style="width: 16px; height: 16px; background: #e74c3c; border-radius: 50%;"></div>
					<span style="font-size: 12px; color: #666;">High Activity</span>
				</div>
				<div style="display: flex; align-items: center; gap: 5px;">
					<div style="width: 16px; height: 16px; background: #f39c12; border-radius: 50%;"></div>
					<span style="font-size: 12px; color: #666;">Medium Activity</span>
				</div>
				<div style="display: flex; align-items: center; gap: 5px;">
					<div style="width: 16px; height: 16px; background: #95a5a6; border-radius: 50%;"></div>
					<span style="font-size: 12px; color: #666;">Low Activity</span>
				</div>
			</div>
		</div>
	`;
};

const renderSARHeatmap = (container: HTMLElement) => {
	const compounds = ['Cpd-001', 'Cpd-002', 'Cpd-003', 'Cpd-004', 'Cpd-005'];
	const assays = ['Assay A', 'Assay B', 'Assay C', 'Assay D'];

	// Mock IC50 values (nM) - lower is better
	const data = [
		[12, 450, 89, 1200],
		[8, 320, 156, 890],
		[156, 78, 23, 2300],
		[890, 12, 567, 450],
		[45, 234, 34, 156],
	];

	const cellSize = 60;
	const labelWidth = 80;
	const labelHeight = 30;

	const getColor = (value: number) => {
		// Green (low IC50/high potency) to Red (high IC50/low potency)
		if (value < 50) return '#27ae60';
		if (value < 200) return '#f39c12';
		return '#e74c3c';
	};

	const cells = data.flatMap((row, i) =>
		row.map((value, j) => {
			const x = labelWidth + j * cellSize;
			const y = labelHeight + i * cellSize;
			return `
				<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${getColor(value)}" stroke="#fff" stroke-width="2"/>
				<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 5}" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">${value}</text>
			`;
		})
	).join('');

	const rowLabels = compounds.map((label, i) =>
		`<text x="${labelWidth - 10}" y="${labelHeight + i * cellSize + cellSize / 2 + 5}" text-anchor="end" font-size="12" fill="#666">${label}</text>`
	).join('');

	const colLabels = assays.map((label, i) =>
		`<text x="${labelWidth + i * cellSize + cellSize / 2}" y="${labelHeight - 10}" text-anchor="middle" font-size="12" fill="#666">${label}</text>`
	).join('');

	const svgWidth = labelWidth + assays.length * cellSize + 20;
	const svgHeight = labelHeight + compounds.length * cellSize + 20;

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Structure-Activity Relationship Heatmap</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="${svgWidth}" height="${svgHeight}">
					${rowLabels}
					${colLabels}
					${cells}
				</svg>
			</div>
			<div style="margin-top: 20px; text-align: center;">
				<p style="font-size: 12px; color: #666; margin: 0;">IC₅₀ values (nM) - Lower values indicate higher potency</p>
				<div style="margin-top: 10px; display: flex; justify-content: center; gap: 15px;">
					<div style="display: flex; align-items: center; gap: 5px;">
						<div style="width: 20px; height: 20px; background: #27ae60;"></div>
						<span style="font-size: 11px; color: #666;">&lt; 50 nM</span>
					</div>
					<div style="display: flex; align-items: center; gap: 5px;">
						<div style="width: 20px; height: 20px; background: #f39c12;"></div>
						<span style="font-size: 11px; color: #666;">50-200 nM</span>
					</div>
					<div style="display: flex; align-items: center; gap: 5px;">
						<div style="width: 20px; height: 20px; background: #e74c3c;"></div>
						<span style="font-size: 11px; color: #666;">&gt; 200 nM</span>
					</div>
				</div>
			</div>
		</div>
	`;
};

const renderSimilarityNetwork = (container: HTMLElement) => {
	const nodes = [
		{id: 1, x: 300, y: 200, label: 'A', color: '#3498db'},
		{id: 2, x: 200, y: 150, label: 'B', color: '#3498db'},
		{id: 3, x: 400, y: 150, label: 'C', color: '#3498db'},
		{id: 4, x: 250, y: 280, label: 'D', color: '#e74c3c'},
		{id: 5, x: 350, y: 280, label: 'E', color: '#e74c3c'},
		{id: 6, x: 150, y: 250, label: 'F', color: '#2ecc71'},
		{id: 7, x: 450, y: 250, label: 'G', color: '#2ecc71'},
	];

	const edges = [
		{from: 1, to: 2, similarity: 0.85},
		{from: 1, to: 3, similarity: 0.82},
		{from: 1, to: 4, similarity: 0.75},
		{from: 1, to: 5, similarity: 0.78},
		{from: 2, to: 6, similarity: 0.88},
		{from: 3, to: 7, similarity: 0.86},
		{from: 4, to: 5, similarity: 0.92},
	];

	const edgeLines = edges.map(e => {
		const from = nodes.find(n => n.id === e.from)!;
		const to = nodes.find(n => n.id === e.to)!;
		const opacity = e.similarity;
		return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#95a5a6" stroke-width="2" opacity="${opacity}">
			<title>Tanimoto: ${e.similarity}</title>
		</line>`;
	}).join('');

	const nodeCircles = nodes.map(n => `
		<circle cx="${n.x}" cy="${n.y}" r="25" fill="${n.color}" stroke="#fff" stroke-width="3"/>
		<text x="${n.x}" y="${n.y + 5}" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">${n.label}</text>
	`).join('');

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Molecular Similarity Network</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="600" height="400" style="border: 1px solid #ddd; border-radius: 4px; background: #fafafa;">
					${edgeLines}
					${nodeCircles}
				</svg>
			</div>
			<div style="margin-top: 20px; text-align: center;">
				<p style="font-size: 12px; color: #666; margin-bottom: 10px;">
					Nodes represent compounds, edges show Tanimoto similarity &gt; 0.7
				</p>
				<div style="display: flex; justify-content: center; gap: 20px;">
					<div style="display: flex; align-items: center; gap: 5px;">
						<div style="width: 16px; height: 16px; background: #3498db; border-radius: 50%;"></div>
						<span style="font-size: 11px; color: #666;">Series A</span>
					</div>
					<div style="display: flex; align-items: center; gap: 5px;">
						<div style="width: 16px; height: 16px; background: #e74c3c; border-radius: 50%;"></div>
						<span style="font-size: 11px; color: #666;">Series B</span>
					</div>
					<div style="display: flex; align-items: center; gap: 5px;">
						<div style="width: 16px; height: 16px; background: #2ecc71; border-radius: 50%;"></div>
						<span style="font-size: 11px; color: #666;">Series C</span>
					</div>
				</div>
			</div>
		</div>
	`;
};

const renderMatchedPairs = (RDKit: any, container: HTMLElement) => {
	try {
		// Matched pair: Methyl vs Ethyl substitution
		const mol1 = RDKit.get_mol('CC(=O)Nc1ccc(O)cc1'); // Paracetamol
		const mol2 = RDKit.get_mol('CCc1ccc(O)cc1NC(C)=O'); // Ethyl analog

		const svg1 = mol1.get_svg();
		const svg2 = mol2.get_svg();

		container.innerHTML = `
			<div style="padding: 20px;">
				<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Matched Molecular Pairs Analysis</h4>
				<div style="display: flex; gap: 30px; justify-content: center; align-items: center;">
					<div style="flex: 1; max-width: 300px;">
						<div style="border: 2px solid #3498db; border-radius: 8px; padding: 15px; background: #fff;">
							<div style="margin-bottom: 10px;">${svg1}</div>
							<h5 style="margin: 10px 0 5px 0; color: #333; font-size: 14px;">Compound A</h5>
							<div style="font-size: 12px; color: #666;">
								<p style="margin: 5px 0;"><strong>MW:</strong> 151.16 g/mol</p>
								<p style="margin: 5px 0;"><strong>LogP:</strong> 0.46</p>
								<p style="margin: 5px 0;"><strong>IC₅₀:</strong> 125 nM</p>
							</div>
						</div>
					</div>

					<div style="text-align: center;">
						<div style="font-size: 24px; color: #666; margin-bottom: 10px;">→</div>
						<div style="background: #f39c12; color: #fff; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">
							CH₃ → CH₂CH₃
						</div>
					</div>

					<div style="flex: 1; max-width: 300px;">
						<div style="border: 2px solid #e74c3c; border-radius: 8px; padding: 15px; background: #fff;">
							<div style="margin-bottom: 10px;">${svg2}</div>
							<h5 style="margin: 10px 0 5px 0; color: #333; font-size: 14px;">Compound B</h5>
							<div style="font-size: 12px; color: #666;">
								<p style="margin: 5px 0;"><strong>MW:</strong> 165.19 g/mol</p>
								<p style="margin: 5px 0;"><strong>LogP:</strong> 0.89</p>
								<p style="margin: 5px 0;"><strong>IC₅₀:</strong> 78 nM</p>
							</div>
						</div>
					</div>
				</div>

				<div style="margin-top: 30px; background: #ecf0f1; padding: 20px; border-radius: 8px;">
					<h5 style="margin: 0 0 15px 0; color: #333;">Property Changes (Δ)</h5>
					<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
						<div style="text-align: center;">
							<div style="font-size: 20px; font-weight: bold; color: #e74c3c;">+14.03</div>
							<div style="font-size: 11px; color: #666;">ΔMW (g/mol)</div>
						</div>
						<div style="text-align: center;">
							<div style="font-size: 20px; font-weight: bold; color: #e74c3c;">+0.43</div>
							<div style="font-size: 11px; color: #666;">ΔLogP</div>
						</div>
						<div style="text-align: center;">
							<div style="font-size: 20px; font-weight: bold; color: #27ae60;">-47 nM</div>
							<div style="font-size: 11px; color: #666;">ΔIC₅₀ (improved)</div>
						</div>
					</div>
				</div>
			</div>
		`;

		mol1.delete();
		mol2.delete();
	} catch (err) {
		container.innerHTML = '<div style="padding: 20px;">Error rendering matched pairs</div>';
	}
};

export default ChemicalStructureViewer;

