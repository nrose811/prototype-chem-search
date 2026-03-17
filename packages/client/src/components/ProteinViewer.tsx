import {useEffect, useRef, useState} from 'react';
import type {ChartType} from '../types/visualizations';
import './PlotlyChart.css';

export interface ProteinViewerProps {
	chartType: ChartType;
	title?: string;
	className?: string;
}

const ProteinViewer = ({chartType, title, className}: ProteinViewerProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadMolstar = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Wait for the ref to be ready
				await new Promise(resolve => setTimeout(resolve, 0));

				if (!containerRef.current) {
					setIsLoading(false);
					return;
				}

				// Render based on chart type
				switch (chartType) {
					case 'protein-3d':
						await renderProtein3D(containerRef.current);
						break;
					case 'domain-architecture':
						renderDomainArchitecture(containerRef.current);
						break;
					case 'contact-map':
						renderContactMap(containerRef.current);
						break;
					case 'secondary-structure':
						renderSecondaryStructure(containerRef.current);
						break;
					case 'disorder-profile':
						renderDisorderProfile(containerRef.current);
						break;
					case 'md-trajectory':
						renderMDTrajectory(containerRef.current);
						break;
					default:
						renderPlaceholder(chartType, containerRef.current);
				}

				setIsLoading(false);
			} catch (err) {
				console.error('Error loading Mol*:', err);
				setError('Failed to load protein viewer');
				setIsLoading(false);
			}
		};

		loadMolstar();
	}, [chartType]);

	return (
		<div className={`plotly-chart-container ${className || ''}`}>
			{title && <h3 className="chart-title">{title}</h3>}
			{isLoading && <div className="chart-loading">Loading protein viewer...</div>}
			{error && <div className="chart-error">{error}</div>}
			<div ref={containerRef} style={{width: '100%', height: '100%', minHeight: '500px', display: isLoading || error ? 'none' : 'block'}} />
		</div>
	);
};

// Render functions for different protein visualization types

const renderProtein3D = async (container: HTMLElement) => {
	try {
		// For now, show a styled placeholder with protein structure info
		// Full Mol* integration would require loading the Mol* library and PDB files
		container.innerHTML = `
			<div style="padding: 20px;">
				<h4 style="text-align: center; margin-bottom: 20px; color: #333;">3D Protein Structure</h4>
				<div style="display: flex; justify-content: center; align-items: center; height: 400px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
					<div style="text-align: center; padding: 40px;">
						<div style="font-size: 64px; margin-bottom: 16px;">🧬</div>
						<h3 style="margin: 0 0 16px 0;">Hemoglobin (1HHO)</h3>
						<p style="margin: 0 0 24px 0; font-size: 14px; opacity: 0.9;">Interactive 3D protein structure viewer</p>
						<div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 4px; font-size: 12px;">
							<p style="margin: 0 0 8px 0;"><strong>Chains:</strong> A, B, C, D</p>
							<p style="margin: 0 0 8px 0;"><strong>Residues:</strong> 574</p>
							<p style="margin: 0;"><strong>Ligands:</strong> 4 × HEM</p>
						</div>
					</div>
				</div>
			</div>
		`;
	} catch (err) {
		container.innerHTML = '<div style="padding: 20px;">Error rendering 3D protein structure</div>';
	}
};

const renderDomainArchitecture = (container: HTMLElement) => {
	const domains = [
		{name: 'Signal', start: 1, end: 25, color: '#e74c3c'},
		{name: 'N-terminal', start: 26, end: 120, color: '#3498db'},
		{name: 'Catalytic', start: 121, end: 350, color: '#2ecc71'},
		{name: 'Regulatory', start: 351, end: 450, color: '#f39c12'},
		{name: 'C-terminal', start: 451, end: 520, color: '#9b59b6'},
	];

	const totalLength = 520;
	const width = 700;
	const height = 150;
	const barHeight = 40;
	const yPos = (height - barHeight) / 2;

	const domainRects = domains.map(d => {
		const x = (d.start / totalLength) * width;
		const w = ((d.end - d.start) / totalLength) * width;
		return `
			<rect x="${x}" y="${yPos}" width="${w}" height="${barHeight}" fill="${d.color}" stroke="#fff" stroke-width="2" rx="4"/>
			<text x="${x + w/2}" y="${yPos + barHeight/2 + 5}" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">${d.name}</text>
		`;
	}).join('');

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Protein Domain Architecture</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="${width}" height="${height}">
					${domainRects}
					<text x="0" y="${height - 10}" font-size="10" fill="#666">1</text>
					<text x="${width - 20}" y="${height - 10}" font-size="10" fill="#666">${totalLength}</text>
				</svg>
			</div>
			<div style="margin-top: 20px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
				${domains.map(d => `
					<div style="display: flex; align-items: center; gap: 5px;">
						<div style="width: 16px; height: 16px; background: ${d.color}; border-radius: 2px;"></div>
						<span style="font-size: 11px; color: #666;">${d.name} (${d.start}-${d.end})</span>
					</div>
				`).join('')}
			</div>
		</div>
	`;
};

const renderContactMap = (container: HTMLElement) => {
	const size = 50;
	const cellSize = 6;
	const svgSize = size * cellSize;

	// Generate mock contact map data
	const contacts: string[] = [];
	for (let i = 0; i < size; i++) {
		for (let j = i; j < size; j++) {
			const distance = Math.abs(i - j);
			if (distance > 3 && Math.random() < 0.1) {
				const intensity = Math.random();
				const color = intensity > 0.7 ? '#e74c3c' : intensity > 0.4 ? '#f39c12' : '#3498db';
				contacts.push(`<rect x="${i * cellSize}" y="${j * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}"/>`);
			}
		}
	}

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Residue Contact Map</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="${svgSize}" height="${svgSize}" style="border: 1px solid #ddd; background: #f9f9f9;">
					${contacts.join('')}
				</svg>
			</div>
			<div style="margin-top: 15px; text-align: center;">
				<p style="font-size: 12px; color: #666; margin: 0;">Distance matrix showing residue-residue contacts (&lt; 8Å)</p>
				<div style="margin-top: 10px; display: flex; justify-content: center; gap: 15px;">
					<div style="display: flex; align-items: center; gap: 5px;">
						<div style="width: 16px; height: 16px; background: #e74c3c;"></div>
						<span style="font-size: 11px; color: #666;">&lt; 5Å</span>
					</div>
					<div style="display: flex; align-items: center; gap: 5px;">
						<div style="width: 16px; height: 16px; background: #f39c12;"></div>
						<span style="font-size: 11px; color: #666;">5-7Å</span>
					</div>
					<div style="display: flex; align-items: center; gap: 5px;">
						<div style="width: 16px; height: 16px; background: #3498db;"></div>
						<span style="font-size: 11px; color: #666;">7-8Å</span>
					</div>
				</div>
			</div>
		</div>
	`;
};

const renderSecondaryStructure = (container: HTMLElement) => {
	const length = 300;
	const width = 700;
	const height = 200;

	// Mock secondary structure data
	const structures = [
		{type: 'helix', start: 10, end: 45, color: '#e74c3c', label: 'α-helix'},
		{type: 'strand', start: 60, end: 75, color: '#f39c12', label: 'β-strand'},
		{type: 'strand', start: 85, end: 100, color: '#f39c12', label: 'β-strand'},
		{type: 'helix', start: 120, end: 160, color: '#e74c3c', label: 'α-helix'},
		{type: 'strand', start: 180, end: 195, color: '#f39c12', label: 'β-strand'},
		{type: 'helix', start: 220, end: 250, color: '#e74c3c', label: 'α-helix'},
	];

	const barHeight = 30;
	const yPos = height / 2 - barHeight / 2;

	const structureRects = structures.map(s => {
		const x = (s.start / length) * width;
		const w = ((s.end - s.start) / length) * width;
		return `<rect x="${x}" y="${yPos}" width="${w}" height="${barHeight}" fill="${s.color}" opacity="0.8" rx="3"/>`;
	}).join('');

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Secondary Structure Profile</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="${width}" height="${height}">
					<line x1="0" y1="${height/2}" x2="${width}" y2="${height/2}" stroke="#ddd" stroke-width="2"/>
					${structureRects}
					<text x="0" y="${height - 10}" font-size="10" fill="#666">1</text>
					<text x="${width - 20}" y="${height - 10}" font-size="10" fill="#666">${length}</text>
					<text x="${width/2}" y="20" text-anchor="middle" font-size="11" fill="#666">Residue Position</text>
				</svg>
			</div>
			<div style="margin-top: 20px; display: flex; justify-content: center; gap: 20px;">
				<div style="display: flex; align-items: center; gap: 5px;">
					<div style="width: 20px; height: 20px; background: #e74c3c; opacity: 0.8; border-radius: 2px;"></div>
					<span style="font-size: 12px; color: #666;">α-helix</span>
				</div>
				<div style="display: flex; align-items: center; gap: 5px;">
					<div style="width: 20px; height: 20px; background: #f39c12; opacity: 0.8; border-radius: 2px;"></div>
					<span style="font-size: 12px; color: #666;">β-strand</span>
				</div>
				<div style="display: flex; align-items: center; gap: 5px;">
					<div style="width: 20px; height: 20px; background: #95a5a6; opacity: 0.8; border-radius: 2px;"></div>
					<span style="font-size: 12px; color: #666;">Coil/Loop</span>
				</div>
			</div>
		</div>
	`;
};

const renderDisorderProfile = (container: HTMLElement) => {
	const length = 300;
	const width = 700;
	const height = 250;
	const padding = 40;

	// Generate mock disorder scores
	const points: string[] = [];
	let pathData = `M ${padding} ${height - padding}`;

	for (let i = 0; i <= length; i += 5) {
		const x = padding + (i / length) * (width - 2 * padding);
		const disorder = Math.random() * 0.8 + (Math.sin(i / 30) * 0.2);
		const y = height - padding - (disorder * (height - 2 * padding));
		pathData += ` L ${x} ${y}`;

		if (disorder > 0.5) {
			points.push(`<circle cx="${x}" cy="${y}" r="3" fill="#e74c3c"/>`);
		}
	}

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Intrinsic Disorder Profile</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="${width}" height="${height}">
					<!-- Axes -->
					<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>
					<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>

					<!-- Threshold line -->
					<line x1="${padding}" y1="${height - padding - 0.5 * (height - 2 * padding)}" x2="${width - padding}" y2="${height - padding - 0.5 * (height - 2 * padding)}" stroke="#e74c3c" stroke-width="1" stroke-dasharray="5,5" opacity="0.5"/>

					<!-- Disorder curve -->
					<path d="${pathData}" fill="none" stroke="#3498db" stroke-width="2"/>
					${points.join('')}

					<!-- Labels -->
					<text x="${width/2}" y="${height - 5}" text-anchor="middle" font-size="11" fill="#666">Residue Position</text>
					<text x="10" y="${height/2}" text-anchor="middle" font-size="11" fill="#666" transform="rotate(-90, 10, ${height/2})">Disorder Score</text>
					<text x="${padding - 5}" y="${height - padding + 5}" text-anchor="end" font-size="10" fill="#666">0.0</text>
					<text x="${padding - 5}" y="${padding + 5}" text-anchor="end" font-size="10" fill="#666">1.0</text>
					<text x="${width - padding + 5}" y="${height - padding + 15}" font-size="10" fill="#666">${length}</text>
				</svg>
			</div>
			<div style="margin-top: 15px; text-align: center;">
				<p style="font-size: 12px; color: #666; margin: 0;">Regions with disorder score &gt; 0.5 are predicted to be intrinsically disordered</p>
			</div>
		</div>
	`;
};

const renderMDTrajectory = (container: HTMLElement) => {
	const frames = 100;
	const width = 700;
	const height = 300;
	const padding = 50;

	// Generate mock RMSD data
	let rmsdPath = `M ${padding} ${height - padding}`;
	for (let i = 0; i <= frames; i++) {
		const x = padding + (i / frames) * (width - 2 * padding);
		const rmsd = 1.5 + Math.random() * 1.5 + Math.sin(i / 10) * 0.5;
		const y = height - padding - (rmsd / 4) * (height - 2 * padding);
		rmsdPath += ` L ${x} ${y}`;
	}

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">MD Trajectory Analysis - RMSD</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="${width}" height="${height}">
					<!-- Axes -->
					<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>
					<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>

					<!-- RMSD curve -->
					<path d="${rmsdPath}" fill="none" stroke="#3498db" stroke-width="2"/>

					<!-- Labels -->
					<text x="${width/2}" y="${height - 5}" text-anchor="middle" font-size="12" fill="#666">Time (ns)</text>
					<text x="15" y="${height/2}" text-anchor="middle" font-size="12" fill="#666" transform="rotate(-90, 15, ${height/2})">RMSD (Å)</text>

					<!-- Axis ticks -->
					<text x="${padding - 5}" y="${height - padding + 5}" text-anchor="end" font-size="10" fill="#666">0</text>
					<text x="${padding - 5}" y="${padding + 5}" text-anchor="end" font-size="10" fill="#666">4</text>
					<text x="${width - padding}" y="${height - padding + 15}" text-anchor="middle" font-size="10" fill="#666">100</text>
				</svg>
			</div>
			<div style="margin-top: 20px; background: #ecf0f1; padding: 15px; border-radius: 4px;">
				<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; text-align: center;">
					<div>
						<div style="font-size: 18px; font-weight: bold; color: #3498db;">2.3 Å</div>
						<div style="font-size: 11px; color: #666;">Average RMSD</div>
					</div>
					<div>
						<div style="font-size: 18px; font-weight: bold; color: #2ecc71;">98.5%</div>
						<div style="font-size: 11px; color: #666;">Equilibration</div>
					</div>
					<div>
						<div style="font-size: 18px; font-weight: bold; color: #f39c12;">100 ns</div>
						<div style="font-size: 11px; color: #666;">Simulation Time</div>
					</div>
				</div>
			</div>
		</div>
	`;
};

const renderPlaceholder = (chartType: ChartType, container: HTMLElement) => {
	const placeholders: Record<string, {title: string; description: string}> = {
		'protein-3d': {
			title: '3D Protein Structure Viewer',
			description: 'Interactive 3D visualization of protein structures with ribbon/cartoon representation',
		},
		'domain-architecture': {
			title: 'Protein Domain Architecture',
			description: 'Linear diagram showing protein domains, motifs, and functional regions',
		},
		'protein-surface': {
			title: 'Protein Surface Map',
			description: 'Molecular surface colored by electrostatic potential or hydrophobicity',
		},
		'binding-site': {
			title: 'Binding Site Visualization',
			description: 'Detailed view of ligand-protein interactions with key residues',
		},
		'protein-interaction': {
			title: 'Protein-Protein Interaction',
			description: 'Interface visualization showing complementary surfaces and contacts',
		},
		'contact-map': {
			title: 'Residue Contact Map',
			description: '2D matrix showing spatial proximity between residues',
		},
		'secondary-structure': {
			title: 'Secondary Structure Plot',
			description: 'Linear representation of helices, strands, and coils',
		},
		'disorder-profile': {
			title: 'Disorder Profile',
			description: 'Per-residue disorder and flexibility predictions',
		},
		'md-trajectory': {
			title: 'MD Trajectory Analysis',
			description: 'RMSD, RMSF, and other metrics from molecular dynamics simulations',
		},
	};

	const info = placeholders[chartType] || {
		title: 'Protein Visualization',
		description: 'Protein structure and analysis visualization',
	};

	container.innerHTML = `
		<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
			<div style="text-align: center; padding: 40px;">
				<h2 style="margin: 0 0 16px 0; font-size: 24px;">${info.title}</h2>
				<p style="margin: 0 0 24px 0; font-size: 14px; opacity: 0.9; max-width: 500px;">${info.description}</p>
				<div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 4px; font-size: 12px;">
					<p style="margin: 0;">Powered by Mol* Viewer</p>
					<p style="margin: 8px 0 0 0; opacity: 0.8;">Full integration coming soon</p>
				</div>
			</div>
		</div>
	`;
};

export default ProteinViewer;

