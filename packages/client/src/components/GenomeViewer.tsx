import {useEffect, useRef, useState} from 'react';
import type {ChartType} from '../types/visualizations';
import './PlotlyChart.css';

export interface GenomeViewerProps {
	chartType: ChartType;
	title?: string;
	className?: string;
}

const GenomeViewer = ({chartType, title, className}: GenomeViewerProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadIGV = async () => {
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
					case 'genome-track':
						renderGenomeTrack(containerRef.current);
						break;
					case 'variant-lollipop':
						renderVariantLollipop(containerRef.current);
						break;
					case 'sequence-logo':
						renderSequenceLogo(containerRef.current);
						break;
					case 'manhattan-plot':
						renderManhattanPlot(containerRef.current);
						break;
					case 'sashimi-plot':
						renderSashimiPlot(containerRef.current);
						break;
					case 'assembly-graph':
						renderAssemblyGraph(containerRef.current);
						break;
					default:
						renderPlaceholder(chartType, containerRef.current);
				}

				setIsLoading(false);
			} catch (err) {
				console.error('Error loading IGV:', err);
				setError('Failed to load genome viewer');
				setIsLoading(false);
			}
		};

		loadIGV();
	}, [chartType]);

	return (
		<div className={`plotly-chart-container ${className || ''}`}>
			{title && <h3 className="chart-title">{title}</h3>}
			{isLoading && <div className="chart-loading">Loading genome viewer...</div>}
			{error && <div className="chart-error">{error}</div>}
			<div ref={containerRef} style={{width: '100%', height: '100%', minHeight: '500px', display: isLoading || error ? 'none' : 'block'}} />
		</div>
	);
};
// Render functions for different genomics visualization types

const renderGenomeTrack = (container: HTMLElement) => {
	const genes = [
		{name: 'BRCA1', start: 100, end: 300, strand: '+', color: '#3498db'},
		{name: 'TP53', start: 400, end: 550, strand: '+', color: '#e74c3c'},
		{name: 'EGFR', start: 650, end: 850, strand: '-', color: '#2ecc71'},
		{name: 'MYC', start: 900, end: 1050, strand: '+', color: '#f39c12'},
	];

	const width = 700;
	const height = 200;
	const trackHeight = 30;
	const yPos = height / 2 - trackHeight / 2;

	const geneRects = genes.map(g => {
		const x = (g.start / 1200) * width;
		const w = ((g.end - g.start) / 1200) * width;
		const arrow = g.strand === '+' ? '▶' : '◀';
		return `
			<rect x="${x}" y="${yPos}" width="${w}" height="${trackHeight}" fill="${g.color}" opacity="0.7" rx="3"/>
			<text x="${x + w/2}" y="${yPos + trackHeight/2 + 5}" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">${g.name} ${arrow}</text>
		`;
	}).join('');

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Genome Browser Track</h4>
			<div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
				<p style="margin: 0; font-size: 12px; color: #666;"><strong>Chromosome:</strong> chr17 | <strong>Position:</strong> 43,000,000 - 43,120,000 | <strong>Reference:</strong> hg38</p>
			</div>
			<div style="display: flex; justify-content: center;">
				<svg width="${width}" height="${height}">
					<line x1="0" y1="${height/2}" x2="${width}" y2="${height/2}" stroke="#999" stroke-width="2"/>
					${geneRects}
					<text x="0" y="${height - 10}" font-size="10" fill="#666">43.0 Mb</text>
					<text x="${width - 50}" y="${height - 10}" font-size="10" fill="#666">43.12 Mb</text>
				</svg>
			</div>
		</div>
	`;
};

const renderVariantLollipop = (container: HTMLElement) => {
	const variants = [
		{pos: 150, type: 'Missense', count: 12, color: '#3498db'},
		{pos: 280, type: 'Nonsense', count: 8, color: '#e74c3c'},
		{pos: 420, type: 'Frameshift', count: 5, color: '#f39c12'},
		{pos: 550, type: 'Missense', count: 15, color: '#3498db'},
		{pos: 680, type: 'Splice', count: 6, color: '#9b59b6'},
		{pos: 820, type: 'Missense', count: 10, color: '#3498db'},
	];

	const width = 700;
	const height = 250;
	const padding = 40;
	const maxCount = Math.max(...variants.map(v => v.count));

	const lollipops = variants.map(v => {
		const x = padding + (v.pos / 1000) * (width - 2 * padding);
		const stemHeight = (v.count / maxCount) * (height - 2 * padding - 30);
		const y = height - padding - stemHeight;
		return `
			<line x1="${x}" y1="${height - padding}" x2="${x}" y2="${y}" stroke="${v.color}" stroke-width="2"/>
			<circle cx="${x}" cy="${y}" r="8" fill="${v.color}"/>
			<text x="${x}" y="${y - 12}" text-anchor="middle" font-size="10" fill="#666">${v.count}</text>
		`;
	}).join('');

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Variant Lollipop Plot</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="${width}" height="${height}">
					<!-- Baseline -->
					<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>

					<!-- Lollipops -->
					${lollipops}

					<!-- Labels -->
					<text x="${width/2}" y="${height - 5}" text-anchor="middle" font-size="11" fill="#666">Protein Position</text>
					<text x="10" y="${height/2}" text-anchor="middle" font-size="11" fill="#666" transform="rotate(-90, 10, ${height/2})">Variant Count</text>
				</svg>
			</div>
			<div style="margin-top: 15px; display: flex; justify-content: center; gap: 15px;">
				<div style="display: flex; align-items: center; gap: 5px;">
					<div style="width: 12px; height: 12px; background: #3498db; border-radius: 50%;"></div>
					<span style="font-size: 11px; color: #666;">Missense</span>
				</div>
				<div style="display: flex; align-items: center; gap: 5px;">
					<div style="width: 12px; height: 12px; background: #e74c3c; border-radius: 50%;"></div>
					<span style="font-size: 11px; color: #666;">Nonsense</span>
				</div>
				<div style="display: flex; align-items: center; gap: 5px;">
					<div style="width: 12px; height: 12px; background: #f39c12; border-radius: 50%;"></div>
					<span style="font-size: 11px; color: #666;">Frameshift</span>
				</div>
				<div style="display: flex; align-items: center; gap: 5px;">
					<div style="width: 12px; height: 12px; background: #9b59b6; border-radius: 50%;"></div>
					<span style="font-size: 11px; color: #666;">Splice</span>
				</div>
			</div>
		</div>
	`;
};

const renderSequenceLogo = (container: HTMLElement) => {
	const positions = 10;
	const bases = ['A', 'C', 'G', 'T'];
	const colors: Record<string, string> = {A: '#27ae60', C: '#3498db', G: '#f39c12', T: '#e74c3c'};

	const width = 600;
	const height = 200;
	const colWidth = width / positions;
	const padding = 40;

	let logos = '';
	for (let i = 0; i < positions; i++) {
		const x = i * colWidth;
		let yOffset = height - padding;

		// Random heights for each base (simulating information content)
		const heights = bases.map(() => Math.random() * 0.8 + 0.2).sort((a, b) => a - b);

		bases.forEach((base, j) => {
			const h = heights[j] * (height - 2 * padding);
			yOffset -= h;
			logos += `
				<text x="${x + colWidth/2}" y="${yOffset + h}" text-anchor="middle" font-size="${h * 0.8}" fill="${colors[base]}" font-weight="bold" font-family="monospace">${base}</text>
			`;
		});
	}

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Sequence Logo</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="${width}" height="${height}">
					${logos}
					<line x1="0" y1="${height - padding}" x2="${width}" y2="${height - padding}" stroke="#333" stroke-width="2"/>
					<text x="${width/2}" y="${height - 5}" text-anchor="middle" font-size="11" fill="#666">Position</text>
					<text x="10" y="${height/2}" text-anchor="middle" font-size="11" fill="#666" transform="rotate(-90, 10, ${height/2})">Bits</text>
				</svg>
			</div>
			<div style="margin-top: 15px; text-align: center;">
				<p style="font-size: 12px; color: #666; margin: 0;">Nucleotide frequency at each position (height = information content)</p>
			</div>
		</div>
	`;
};

const renderManhattanPlot = (container: HTMLElement) => {
	const chromosomes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
	const width = 700;
	const height = 300;
	const padding = 50;

	let points = '';
	let chrLabels = '';
	const chrWidth = (width - 2 * padding) / chromosomes.length;

	chromosomes.forEach((chr, chrIdx) => {
		const chrX = padding + chrIdx * chrWidth;
		const color = chrIdx % 2 === 0 ? '#3498db' : '#2ecc71';

		// Generate random SNPs for each chromosome
		for (let i = 0; i < 20; i++) {
			const x = chrX + Math.random() * chrWidth;
			const pValue = Math.random() * 12;
			const y = height - padding - (pValue / 12) * (height - 2 * padding);
			const radius = pValue > 8 ? 4 : 2;
			points += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="0.6"/>`;
		}

		chrLabels += `<text x="${chrX + chrWidth/2}" y="${height - padding + 20}" text-anchor="middle" font-size="10" fill="#666">${chr}</text>`;
	});

	// Significance threshold line
	const thresholdY = height - padding - (8 / 12) * (height - 2 * padding);

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Manhattan Plot (GWAS)</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="${width}" height="${height}">
					<!-- Axes -->
					<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>
					<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#333" stroke-width="2"/>

					<!-- Significance threshold -->
					<line x1="${padding}" y1="${thresholdY}" x2="${width - padding}" y2="${thresholdY}" stroke="#e74c3c" stroke-width="1" stroke-dasharray="5,5" opacity="0.7"/>
					<text x="${width - padding + 5}" y="${thresholdY}" font-size="9" fill="#e74c3c">p=5×10⁻⁸</text>

					<!-- Data points -->
					${points}

					<!-- Labels -->
					${chrLabels}
					<text x="${width/2}" y="${height - 5}" text-anchor="middle" font-size="12" fill="#666">Chromosome</text>
					<text x="15" y="${height/2}" text-anchor="middle" font-size="12" fill="#666" transform="rotate(-90, 15, ${height/2})">-log₁₀(p)</text>
				</svg>
			</div>
			<div style="margin-top: 15px; text-align: center;">
				<p style="font-size: 12px; color: #666; margin: 0;">Genome-wide association study showing SNP significance across chromosomes</p>
			</div>
		</div>
	`;
};

const renderSashimiPlot = (container: HTMLElement) => {
	const width = 700;
	const height = 250;
	const padding = 40;

	// Exons
	const exons = [
		{start: 100, end: 200},
		{start: 350, end: 450},
		{start: 550, end: 650},
	];

	// Splice junctions
	const junctions = [
		{from: 200, to: 350, count: 45},
		{from: 450, to: 550, count: 38},
	];

	const exonY = height - padding - 20;
	const exonHeight = 30;

	const exonRects = exons.map(e => {
		const x = padding + (e.start / 700) * (width - 2 * padding);
		const w = ((e.end - e.start) / 700) * (width - 2 * padding);
		return `<rect x="${x}" y="${exonY}" width="${w}" height="${exonHeight}" fill="#3498db" rx="3"/>`;
	}).join('');

	const junctionArcs = junctions.map(j => {
		const x1 = padding + (j.from / 700) * (width - 2 * padding);
		const x2 = padding + (j.to / 700) * (width - 2 * padding);
		const midX = (x1 + x2) / 2;
		const arcHeight = (j.count / 50) * 80;
		const controlY = exonY - arcHeight;

		return `
			<path d="M ${x1} ${exonY} Q ${midX} ${controlY} ${x2} ${exonY}" fill="none" stroke="#e74c3c" stroke-width="3" opacity="0.7"/>
			<text x="${midX}" y="${controlY - 5}" text-anchor="middle" font-size="10" fill="#666">${j.count}</text>
		`;
	}).join('');

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Sashimi Plot (RNA-seq Splicing)</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="${width}" height="${height}">
					<!-- Splice junctions (arcs) -->
					${junctionArcs}

					<!-- Exons -->
					${exonRects}

					<!-- Baseline -->
					<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#999" stroke-width="1"/>

					<!-- Labels -->
					<text x="${width/2}" y="${height - 5}" text-anchor="middle" font-size="11" fill="#666">Genomic Position</text>
				</svg>
			</div>
			<div style="margin-top: 15px; text-align: center;">
				<p style="font-size: 12px; color: #666; margin: 0;">Exon coverage with splice junction reads (arc height = read count)</p>
			</div>
		</div>
	`;
};

const renderAssemblyGraph = (container: HTMLElement) => {
	const nodes = [
		{id: 1, x: 150, y: 150, label: 'Contig_1', color: '#3498db'},
		{id: 2, x: 300, y: 100, label: 'Contig_2', color: '#2ecc71'},
		{id: 3, x: 300, y: 200, label: 'Contig_3', color: '#f39c12'},
		{id: 4, x: 450, y: 150, label: 'Contig_4', color: '#e74c3c'},
		{id: 5, x: 550, y: 100, label: 'Contig_5', color: '#9b59b6'},
	];

	const edges = [
		{from: 1, to: 2},
		{from: 1, to: 3},
		{from: 2, to: 4},
		{from: 3, to: 4},
		{from: 4, to: 5},
	];

	const edgeLines = edges.map(e => {
		const from = nodes.find(n => n.id === e.from)!;
		const to = nodes.find(n => n.id === e.to)!;
		return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#95a5a6" stroke-width="2" opacity="0.6"/>`;
	}).join('');

	const nodeCircles = nodes.map(n => `
		<rect x="${n.x - 40}" y="${n.y - 15}" width="80" height="30" fill="${n.color}" rx="5"/>
		<text x="${n.x}" y="${n.y + 5}" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">${n.label}</text>
	`).join('');

	container.innerHTML = `
		<div style="padding: 20px;">
			<h4 style="text-align: center; margin-bottom: 20px; color: #333;">Assembly Graph (De Bruijn)</h4>
			<div style="display: flex; justify-content: center;">
				<svg width="700" height="300" style="border: 1px solid #ddd; border-radius: 4px; background: #fafafa;">
					${edgeLines}
					${nodeCircles}
				</svg>
			</div>
			<div style="margin-top: 15px; text-align: center;">
				<p style="font-size: 12px; color: #666; margin: 0;">Graph representation of genome assembly showing contig relationships</p>
			</div>
		</div>
	`;
};

const renderPlaceholder = (chartType: ChartType, container: HTMLElement) => {
	const placeholders: Record<string, {title: string; description: string; icon: string}> = {
		'genome-track': {
			title: 'Genome Browser Track',
			description: 'Interactive genome browser showing genes, exons, and annotations',
			icon: '🧬',
		},
		'variant-lollipop': {
			title: 'Variant Lollipop Plot',
			description: 'Mutations and variants displayed along the genomic sequence',
			icon: '🎯',
		},
		'sequence-logo': {
			title: 'Sequence Logo',
			description: 'Position-specific nucleotide or amino acid frequencies',
			icon: '📊',
		},
		'manhattan-plot': {
			title: 'Manhattan Plot',
			description: 'Genome-wide association study results across chromosomes',
			icon: '🏙️',
		},
		'sashimi-plot': {
			title: 'Sashimi Plot',
			description: 'RNA-seq coverage with splice junction arcs',
			icon: '🍣',
		},
		'assembly-graph': {
			title: 'Assembly Graph',
			description: 'De Bruijn graph showing contig relationships',
			icon: '🕸️',
		},
		circos: {
			title: 'Circos Plot',
			description: 'Circular genomic visualization showing relationships and features',
			icon: '⭕',
		},
	};

	const info = placeholders[chartType] || {
		title: 'Genomics Visualization',
		description: 'Genome and sequence data visualization',
		icon: '🧬',
	};

	container.innerHTML = `
		<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 8px; color: white;">
			<div style="text-align: center; padding: 40px;">
				<div style="font-size: 64px; margin-bottom: 16px;">${info.icon}</div>
				<h2 style="margin: 0 0 16px 0; font-size: 24px;">${info.title}</h2>
				<p style="margin: 0 0 24px 0; font-size: 14px; opacity: 0.9; max-width: 500px;">${info.description}</p>
				<div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 4px; font-size: 12px;">
					<p style="margin: 0;">Powered by IGV.js</p>
					<p style="margin: 8px 0 0 0; opacity: 0.8;">Full integration coming soon</p>
				</div>
			</div>
		</div>
	`;
};

export default GenomeViewer;

