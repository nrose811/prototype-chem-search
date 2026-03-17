import type {ChartType} from '../types/visualizations';

export interface MockDataResult {
	data: any[];
	layout: any;
	config?: any;
}

// Helper functions
const randomNormal = (mean: number, std: number) => {
	const u1 = Math.random();
	const u2 = Math.random();
	const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
	return z0 * std + mean;
};

const generateTimePoints = (count: number, startDate?: Date) => {
	const start = startDate || new Date('2024-01-01');
	return Array.from({length: count}, (_, i) => {
		const date = new Date(start);
		date.setDate(date.getDate() + i);
		return date.toISOString().split('T')[0];
	});
};

// Core workhorse plots
export const generateLineChartData = (): MockDataResult => {
	const timePoints = generateTimePoints(30);
	const baseline = 37.0;

	return {
		data: [
			{
				x: timePoints,
				y: timePoints.map((_, i) => baseline + Math.sin(i / 5) * 2 + randomNormal(0, 0.3)),
				type: 'scatter',
				mode: 'lines+markers',
				name: 'Temperature (°C)',
				line: {color: '#1976D2', width: 2},
				marker: {size: 6},
			},
		],
		layout: {
			title: 'Bioreactor Temperature Over Time',
			xaxis: {title: 'Date'},
			yaxis: {title: 'Temperature (°C)'},
			hovermode: 'closest',
		},
	};
};

export const generateScatterPlotData = (): MockDataResult => {
	const concentrations = Array.from({length: 50}, () => Math.random() * 100);
	const responses = concentrations.map((c) => 0.85 * c + randomNormal(0, 5));

	return {
		data: [
			{
				x: concentrations,
				y: responses,
				type: 'scatter',
				mode: 'markers',
				name: 'Measurements',
				marker: {size: 8, color: '#1976D2', opacity: 0.6},
			},
			{
				x: [0, 100],
				y: [0, 85],
				type: 'scatter',
				mode: 'lines',
				name: 'Linear Fit (R² = 0.82)',
				line: {color: '#FF6B6B', dash: 'dash', width: 2},
			},
		],
		layout: {
			title: 'Calibration Curve: Concentration vs Response',
			xaxis: {title: 'Concentration (µM)'},
			yaxis: {title: 'Response (AU)'},
			hovermode: 'closest',
		},
	};
};

export const generateBarChartData = (): MockDataResult => {
	const experiments = ['Control', 'Treatment A', 'Treatment B', 'Treatment C'];
	const values = [28, 35, 45, 32];

	return {
		data: [
			{
				x: experiments,
				y: values,
				type: 'bar',
				marker: {color: ['#1976D2', '#42A5F5', '#64B5F6', '#90CAF9']},
			},
		],
		layout: {
			title: 'Sample Counts by Experiment',
			xaxis: {title: 'Experiment'},
			yaxis: {title: 'Sample Count'},
		},
	};
};

export const generateBoxPlotData = (): MockDataResult => {
	const groups = ['Plate 1', 'Plate 2', 'Plate 3', 'Plate 4'];

	return {
		data: groups.map((group, i) => ({
			y: Array.from({length: 30}, () => randomNormal(100 + i * 5, 8)),
			type: 'box',
			name: group,
			boxmean: 'sd',
		})),
		layout: {
			title: 'Assay Variability Across Plates',
			yaxis: {title: 'Signal Intensity (AU)'},
		},
	};
};

export const generateViolinPlotData = (): MockDataResult => {
	const conditions = ['Control', 'Low Dose', 'High Dose'];

	return {
		data: conditions.map((condition, i) => ({
			y: Array.from({length: 50}, () => randomNormal(50 + i * 20, 10)),
			type: 'violin',
			name: condition,
			box: {visible: true},
			meanline: {visible: true},
		})),
		layout: {
			title: 'Response Distribution by Treatment',
			yaxis: {title: 'Response (%)'},
		},
	};
};

export const generateHistogramData = (): MockDataResult => {
	const data = Array.from({length: 500}, () => randomNormal(100, 15));

	return {
		data: [
			{
				x: data,
				type: 'histogram',
				marker: {color: '#1976D2'},
				nbinsx: 30,
			},
		],
		layout: {
			title: 'QC Metric Distribution',
			xaxis: {title: 'Signal Intensity (AU)'},
			yaxis: {title: 'Frequency'},
		},
	};
};

// Experimental design and statistics
export const generateErrorBarData = (): MockDataResult => {
	const conditions = ['Control', 'Treatment A', 'Treatment B', 'Treatment C'];
	const means = [45, 62, 78, 55];
	const errors = [5, 7, 6, 8];

	return {
		data: [
			{
				x: conditions,
				y: means,
				type: 'bar',
				error_y: {
					type: 'data',
					array: errors,
					visible: true,
				},
				marker: {color: '#1976D2'},
			},
		],
		layout: {
			title: 'Treatment Effects (Mean ± SD)',
			xaxis: {title: 'Condition'},
			yaxis: {title: 'Response (%)'},
		},
	};
};

export const generateDoseResponseData = (): MockDataResult => {
	const doses = Array.from({length: 20}, (_, i) => Math.pow(10, -3 + i * 0.3));
	const ec50 = 0.5;
	const hillSlope = 1.0;
	const responses = doses.map((d) => 100 / (1 + Math.pow(ec50 / d, hillSlope)) + randomNormal(0, 3));

	return {
		data: [
			{
				x: doses,
				y: responses,
				type: 'scatter',
				mode: 'markers',
				name: 'Data',
				marker: {size: 8, color: '#1976D2'},
			},
		],
		layout: {
			title: 'Dose-Response Curve (EC50 = 0.5 µM)',
			xaxis: {title: 'Concentration (µM)', type: 'log'},
			yaxis: {title: 'Response (%)'},
		},
	};
};

export const generateROCData = (): MockDataResult => {
	const points = 100;
	const fpr = Array.from({length: points}, (_, i) => i / points);
	const tpr = fpr.map((x) => Math.pow(x, 0.5) + randomNormal(0, 0.02));

	return {
		data: [
			{
				x: fpr,
				y: tpr,
				type: 'scatter',
				mode: 'lines',
				name: 'Model (AUC = 0.85)',
				line: {color: '#1976D2', width: 3},
			},
			{
				x: [0, 1],
				y: [0, 1],
				type: 'scatter',
				mode: 'lines',
				name: 'Random Classifier',
				line: {color: '#999', dash: 'dash'},
			},
		],
		layout: {
			title: 'ROC Curve - Assay Classification Performance',
			xaxis: {title: 'False Positive Rate'},
			yaxis: {title: 'True Positive Rate'},
		},
	};
};

// High-throughput, omics, and multivariate
export const generateHeatmapData = (): MockDataResult => {
	const rows = 8;
	const cols = 12;
	const z = Array.from({length: rows}, (_, i) =>
		Array.from({length: cols}, (_, j) => randomNormal(100, 20) + (i + j) * 2),
	);

	return {
		data: [
			{
				z: z,
				type: 'heatmap',
				colorscale: 'Viridis',
				colorbar: {title: 'Intensity'},
			},
		],
		layout: {
			title: '96-Well Plate Heatmap',
			xaxis: {title: 'Column', tickvals: Array.from({length: cols}, (_, i) => i), ticktext: Array.from({length: cols}, (_, i) => i + 1)},
			yaxis: {title: 'Row', tickvals: Array.from({length: rows}, (_, i) => i), ticktext: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']},
		},
	};
};

export const generatePCAData = (): MockDataResult => {
	const groups = ['Control', 'Treatment A', 'Treatment B'];
	const colors = ['#1976D2', '#FF6B6B', '#4ECDC4'];

	return {
		data: groups.map((group, idx) => ({
			x: Array.from({length: 20}, () => randomNormal(idx * 10, 5)),
			y: Array.from({length: 20}, () => randomNormal(idx * 8, 4)),
			type: 'scatter',
			mode: 'markers',
			name: group,
			marker: {size: 10, color: colors[idx], opacity: 0.7},
		})),
		layout: {
			title: 'PCA - Sample Clustering',
			xaxis: {title: 'PC1 (45.2% variance)'},
			yaxis: {title: 'PC2 (28.7% variance)'},
		},
	};
};

export const generateVolcanoData = (): MockDataResult => {
	const n = 200;
	const foldChanges = Array.from({length: n}, () => randomNormal(0, 1.5));
	const pValues = foldChanges.map((fc) => Math.pow(10, -Math.abs(fc) - randomNormal(0, 0.5)));

	return {
		data: [
			{
				x: foldChanges,
				y: pValues.map((p) => -Math.log10(p)),
				type: 'scatter',
				mode: 'markers',
				marker: {
					size: 6,
					color: foldChanges.map((fc, i) => (Math.abs(fc) > 1 && pValues[i] < 0.05 ? '#FF6B6B' : '#999')),
					opacity: 0.6,
				},
			},
		],
		layout: {
			title: 'Volcano Plot - Differential Expression',
			xaxis: {title: 'Log2 Fold Change'},
			yaxis: {title: '-Log10 P-value'},
		},
	};
};

export const generateBubbleData = (): MockDataResult => {
	const pathways = ['Pathway A', 'Pathway B', 'Pathway C', 'Pathway D', 'Pathway E'];
	const data = pathways.map((name) => ({
		name,
		enrichment: randomNormal(3, 1),
		pValue: Math.random() * 0.05,
		geneCount: Math.floor(Math.random() * 50) + 10,
	}));

	return {
		data: [
			{
				x: data.map((d) => d.enrichment),
				y: data.map((d) => -Math.log10(d.pValue)),
				mode: 'markers',
				type: 'scatter',
				text: data.map((d) => d.name),
				marker: {
					size: data.map((d) => d.geneCount / 2),
					color: data.map((d) => d.pValue),
					colorscale: 'Viridis',
					showscale: true,
					colorbar: {title: 'P-value'},
				},
			},
		],
		layout: {
			title: 'Pathway Enrichment Analysis',
			xaxis: {title: 'Enrichment Score'},
			yaxis: {title: '-Log10 P-value'},
		},
	};
};

// Chemistry and analytical
export const generateChromatogramData = (): MockDataResult => {
	const timePoints = Array.from({length: 300}, (_, i) => i * 0.1);
	const peak1 = timePoints.map((t) => 100 * Math.exp(-Math.pow((t - 5) / 0.5, 2)));
	const peak2 = timePoints.map((t) => 150 * Math.exp(-Math.pow((t - 12) / 0.7, 2)));
	const peak3 = timePoints.map((t) => 80 * Math.exp(-Math.pow((t - 18) / 0.4, 2)));
	const signal = timePoints.map((t, i) => peak1[i] + peak2[i] + peak3[i] + randomNormal(5, 1));

	return {
		data: [
			{
				x: timePoints,
				y: signal,
				type: 'scatter',
				mode: 'lines',
				line: {color: '#1976D2', width: 1.5},
			},
		],
		layout: {
			title: 'HPLC Chromatogram',
			xaxis: {title: 'Retention Time (min)'},
			yaxis: {title: 'Signal Intensity (mAU)'},
		},
	};
};

export const generateSpectraData = (): MockDataResult => {
	const wavelengths = Array.from({length: 200}, (_, i) => 200 + i * 2);
	const absorbance = wavelengths.map((w) => {
		const peak1 = 0.8 * Math.exp(-Math.pow((w - 280) / 20, 2));
		const peak2 = 0.5 * Math.exp(-Math.pow((w - 350) / 30, 2));
		return peak1 + peak2 + randomNormal(0, 0.02);
	});

	return {
		data: [
			{
				x: wavelengths,
				y: absorbance,
				type: 'scatter',
				mode: 'lines',
				line: {color: '#1976D2', width: 2},
			},
		],
		layout: {
			title: 'UV-Vis Absorption Spectrum',
			xaxis: {title: 'Wavelength (nm)'},
			yaxis: {title: 'Absorbance (AU)'},
		},
	};
};

export const generateKineticsData = (): MockDataResult => {
	const substrates = [0.1, 0.5, 1, 2, 5, 10, 20, 50];
	const vmax = 100;
	const km = 5;
	const velocities = substrates.map((s) => (vmax * s) / (km + s) + randomNormal(0, 3));

	return {
		data: [
			{
				x: substrates,
				y: velocities,
				type: 'scatter',
				mode: 'markers+lines',
				marker: {size: 10, color: '#1976D2'},
				line: {color: '#1976D2'},
			},
		],
		layout: {
			title: 'Michaelis-Menten Kinetics (Km = 5 µM)',
			xaxis: {title: 'Substrate Concentration (µM)'},
			yaxis: {title: 'Reaction Velocity (µM/min)'},
		},
	};
};

// Clinical
export const generateLongitudinalData = (): MockDataResult => {
	const visits = ['Baseline', 'Week 4', 'Week 8', 'Week 12', 'Week 16'];
	const subjects = ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4'];
	const colors = ['#1976D2', '#FF6B6B', '#4ECDC4', '#FFD93D'];

	return {
		data: subjects.map((subject, idx) => ({
			x: visits,
			y: visits.map((_, i) => 100 + idx * 10 - i * 5 + randomNormal(0, 3)),
			type: 'scatter',
			mode: 'lines+markers',
			name: subject,
			line: {color: colors[idx]},
			marker: {size: 8},
		})),
		layout: {
			title: 'Biomarker Levels Over Time',
			xaxis: {title: 'Visit'},
			yaxis: {title: 'Biomarker Level (ng/mL)'},
		},
	};
};

// Additional useful types
export const generatePieData = (): MockDataResult => {
	return {
		data: [
			{
				values: [42, 28, 18, 12],
				labels: ['Type A', 'Type B', 'Type C', 'Type D'],
				type: 'pie',
				marker: {colors: ['#1976D2', '#42A5F5', '#64B5F6', '#90CAF9']},
			},
		],
		layout: {
			title: 'Sample Type Distribution',
		},
	};
};

export const generateSankeyData = (): MockDataResult => {
	return {
		data: [
			{
				type: 'sankey',
				node: {
					label: ['Raw Samples', 'QC Pass', 'QC Fail', 'Analysis', 'Archive', 'Retest'],
					color: ['#1976D2', '#4ECDC4', '#FF6B6B', '#FFD93D', '#95E1D3', '#F38181'],
					pad: 15,
				},
				link: {
					source: [0, 0, 1, 1, 2],
					target: [1, 2, 3, 4, 5],
					value: [850, 150, 700, 150, 100],
				},
			},
		],
		layout: {
			title: 'Sample Processing Flow',
		},
	};
};

// Chemical compound visualizations
export const generateStructure2DData = (): MockDataResult => {
	// For 2D structures, we'll use a scatter plot to represent atoms and lines for bonds
	// In a real implementation, you'd use a library like RDKit.js or Kekule.js
	const atoms = [
		{x: 0, y: 0, label: 'C'},
		{x: 1, y: 0, label: 'C'},
		{x: 1.5, y: 0.866, label: 'C'},
		{x: 1, y: 1.732, label: 'C'},
		{x: 0, y: 1.732, label: 'C'},
		{x: -0.5, y: 0.866, label: 'C'},
		{x: 2, y: 0, label: 'O'},
		{x: -1, y: 0, label: 'N'},
	];

	return {
		data: [
			{
				x: atoms.map((a) => a.x),
				y: atoms.map((a) => a.y),
				mode: 'markers+text',
				type: 'scatter',
				text: atoms.map((a) => a.label),
				textposition: 'middle center',
				marker: {size: 20, color: '#1976D2'},
				showlegend: false,
			},
		],
		layout: {
			title: '2D Chemical Structure (Benzene Derivative)',
			xaxis: {showgrid: false, zeroline: false, showticklabels: false},
			yaxis: {showgrid: false, zeroline: false, showticklabels: false},
			annotations: [
				{
					text: 'SMILES: c1ccccc1(O)(N)<br>MW: 109.13 g/mol',
					xref: 'paper',
					yref: 'paper',
					x: 0.5,
					y: -0.1,
					showarrow: false,
					font: {size: 12},
				},
			],
		},
	};
};

export const generateChemicalSpaceData = (): MockDataResult => {
	// Chemical space using t-SNE/UMAP-like projection
	const compounds = Array.from({length: 100}, (_, i) => ({
		x: randomNormal(0, 2),
		y: randomNormal(0, 2),
		activity: Math.random() > 0.7 ? 'Active' : 'Inactive',
		ic50: Math.random() * 1000,
	}));

	const active = compounds.filter((c) => c.activity === 'Active');
	const inactive = compounds.filter((c) => c.activity === 'Inactive');

	return {
		data: [
			{
				x: active.map((c) => c.x),
				y: active.map((c) => c.y),
				mode: 'markers',
				type: 'scatter',
				name: 'Active',
				marker: {size: 10, color: '#4CAF50'},
				text: active.map((c) => `IC50: ${c.ic50.toFixed(1)} nM`),
			},
			{
				x: inactive.map((c) => c.x),
				y: inactive.map((c) => c.y),
				mode: 'markers',
				type: 'scatter',
				name: 'Inactive',
				marker: {size: 10, color: '#9E9E9E'},
				text: inactive.map((c) => `IC50: ${c.ic50.toFixed(1)} nM`),
			},
		],
		layout: {
			title: 'Chemical Space Map (t-SNE Projection)',
			xaxis: {title: 't-SNE 1'},
			yaxis: {title: 't-SNE 2'},
			hovermode: 'closest',
		},
	};
};

export const generatePropertyPlotData = (): MockDataResult => {
	// LogP vs Molecular Weight
	const compounds = Array.from({length: 80}, () => ({
		mw: 200 + Math.random() * 400,
		logp: -2 + Math.random() * 8,
		series: Math.random() > 0.5 ? 'Series A' : 'Series B',
	}));

	const seriesA = compounds.filter((c) => c.series === 'Series A');
	const seriesB = compounds.filter((c) => c.series === 'Series B');

	return {
		data: [
			{
				x: seriesA.map((c) => c.mw),
				y: seriesA.map((c) => c.logp),
				mode: 'markers',
				type: 'scatter',
				name: 'Series A',
				marker: {size: 10, color: '#1976D2'},
			},
			{
				x: seriesB.map((c) => c.mw),
				y: seriesB.map((c) => c.logp),
				mode: 'markers',
				type: 'scatter',
				name: 'Series B',
				marker: {size: 10, color: '#FF9800'},
			},
		],
		layout: {
			title: 'Molecular Properties: LogP vs Molecular Weight',
			xaxis: {title: 'Molecular Weight (g/mol)'},
			yaxis: {title: 'LogP'},
			shapes: [
				// Lipinski's Rule of 5 boundary
				{type: 'line', x0: 500, y0: -5, x1: 500, y1: 10, line: {dash: 'dash', color: 'red'}},
				{type: 'line', x0: 0, y0: 5, x1: 700, y1: 5, line: {dash: 'dash', color: 'red'}},
			],
			annotations: [
				{x: 500, y: 8, text: 'MW = 500', showarrow: false, font: {color: 'red'}},
				{x: 300, y: 5.5, text: 'LogP = 5', showarrow: false, font: {color: 'red'}},
			],
		},
	};
};

// Protein visualizations
export const generateProtein3DData = (): MockDataResult => {
	// Simplified 3D protein backbone trace
	const residues = 50;
	const backbone = Array.from({length: residues}, (_, i) => ({
		x: Math.cos(i / 5) * 5 + randomNormal(0, 0.5),
		y: Math.sin(i / 5) * 5 + randomNormal(0, 0.5),
		z: i * 0.3 + randomNormal(0, 0.3),
	}));

	return {
		data: [
			{
				x: backbone.map((p) => p.x),
				y: backbone.map((p) => p.y),
				z: backbone.map((p) => p.z),
				mode: 'lines+markers',
				type: 'scatter3d',
				line: {color: '#1976D2', width: 6},
				marker: {size: 4, color: '#42A5F5'},
				name: 'Backbone',
			},
		],
		layout: {
			title: '3D Protein Structure (Backbone Trace)',
			scene: {
				xaxis: {title: 'X (Å)'},
				yaxis: {title: 'Y (Å)'},
				zaxis: {title: 'Z (Å)'},
			},
		},
	};
};

export const generateContactMapData = (): MockDataResult => {
	// Residue-residue contact map
	const size = 50;
	const contacts = Array.from({length: size}, (_, i) =>
		Array.from({length: size}, (_, j) => {
			const dist = Math.abs(i - j);
			if (dist < 3) return 0; // No self-contacts
			return Math.random() > 0.8 ? 8 / (1 + dist * 0.1) : 0;
		})
	);

	return {
		data: [
			{
				z: contacts,
				type: 'heatmap',
				colorscale: 'Blues',
				reversescale: false,
			},
		],
		layout: {
			title: 'Protein Contact Map',
			xaxis: {title: 'Residue Number'},
			yaxis: {title: 'Residue Number'},
		},
	};
};

export const generateDomainArchitectureData = (): MockDataResult => {
	// Domain architecture as horizontal bars
	const domains = [
		{name: 'Signal Peptide', start: 1, end: 20, color: '#FF9800'},
		{name: 'Kinase Domain', start: 50, end: 250, color: '#1976D2'},
		{name: 'SH2 Domain', start: 280, end: 360, color: '#4CAF50'},
		{name: 'Transmembrane', start: 400, end: 425, color: '#9C27B0'},
	];

	return {
		data: domains.map((domain, i) => ({
			x: [domain.end - domain.start],
			y: [0],
			type: 'bar',
			orientation: 'h',
			name: domain.name,
			marker: {color: domain.color},
			base: domain.start,
		})),
		layout: {
			title: 'Protein Domain Architecture (450 aa)',
			xaxis: {title: 'Amino Acid Position'},
			yaxis: {showticklabels: false},
			barmode: 'overlay',
			height: 250,
		},
	};
};

// DNA/RNA sequence visualizations
export const generateGenomeTrackData = (): MockDataResult => {
	// Simplified genome browser track
	const genes = [
		{start: 1000, end: 3000, name: 'Gene A', strand: '+'},
		{start: 3500, end: 5500, name: 'Gene B', strand: '-'},
		{start: 6000, end: 8000, name: 'Gene C', strand: '+'},
		{start: 9000, end: 11000, name: 'Gene D', strand: '+'},
	];

	return {
		data: genes.map((gene, i) => ({
			x: [(gene.start + gene.end) / 2],
			y: [i],
			mode: 'markers+text',
			type: 'scatter',
			text: [gene.name],
			textposition: 'middle center',
			marker: {
				size: 30,
				symbol: gene.strand === '+' ? 'triangle-right' : 'triangle-left',
				color: '#1976D2',
			},
			showlegend: false,
		})),
		layout: {
			title: 'Genome Track View (Chr1: 1,000-12,000 bp)',
			xaxis: {title: 'Genomic Position (bp)'},
			yaxis: {showticklabels: false, title: 'Genes'},
			height: 300,
		},
	};
};

export const generateManhattanPlotData = (): MockDataResult => {
	// GWAS Manhattan plot
	const chromosomes = Array.from({length: 22}, (_, i) => i + 1);
	const data = chromosomes.map((chr) => {
		const snps = Array.from({length: 100}, (_, i) => ({
			chr,
			pos: i * 1000000,
			pvalue: Math.random() < 0.05 ? Math.random() * 1e-8 : Math.random() * 0.1,
		}));
		return {
			x: snps.map((s) => chr + s.pos / 1e8),
			y: snps.map((s) => -Math.log10(s.pvalue)),
			mode: 'markers',
			type: 'scatter',
			name: `Chr ${chr}`,
			marker: {size: 5, color: chr % 2 === 0 ? '#1976D2' : '#42A5F5'},
			showlegend: false,
		};
	});

	return {
		data,
		layout: {
			title: 'Manhattan Plot (GWAS)',
			xaxis: {title: 'Chromosome'},
			yaxis: {title: '-log10(p-value)'},
			shapes: [
				{
					type: 'line',
					x0: 0,
					y0: -Math.log10(5e-8),
					x1: 23,
					y1: -Math.log10(5e-8),
					line: {dash: 'dash', color: 'red', width: 2},
				},
			],
			annotations: [
				{
					x: 11.5,
					y: -Math.log10(5e-8) + 0.5,
					text: 'Genome-wide significance',
					showarrow: false,
					font: {color: 'red'},
				},
			],
		},
	};
};

export const generateSequenceLogoData = (): MockDataResult => {
	// Sequence logo (simplified as stacked bar chart)
	const positions = 10;
	const bases = ['A', 'C', 'G', 'T'];
	const data = bases.map((base) => ({
		x: Array.from({length: positions}, (_, i) => i + 1),
		y: Array.from({length: positions}, () => Math.random()),
		name: base,
		type: 'bar',
	}));

	return {
		data,
		layout: {
			title: 'Sequence Logo (Motif)',
			xaxis: {title: 'Position'},
			yaxis: {title: 'Bits'},
			barmode: 'stack',
		},
	};
};

export const generateCoverageTrackData = (): MockDataResult => {
	// Read coverage track
	const positions = Array.from({length: 100}, (_, i) => i * 100);
	const coverage = positions.map(() => Math.floor(Math.random() * 100) + 20);

	return {
		data: [
			{
				x: positions,
				y: coverage,
				type: 'scatter',
				fill: 'tozeroy',
				fillcolor: 'rgba(25, 118, 210, 0.3)',
				line: {color: '#1976D2', width: 2},
				name: 'Coverage',
			},
		],
		layout: {
			title: 'Sequencing Coverage Track',
			xaxis: {title: 'Genomic Position (bp)'},
			yaxis: {title: 'Read Depth'},
		},
	};
};

// Map chart types to their data generators
export const DATA_GENERATORS: Record<ChartType, () => MockDataResult> = {
	// Core workhorse plots
	line: generateLineChartData,
	scatter: generateScatterPlotData,
	bar: generateBarChartData,
	box: generateBoxPlotData,
	violin: generateViolinPlotData,
	histogram: generateHistogramData,
	// Experimental design and statistics
	'error-bar': generateErrorBarData,
	'dose-response': generateDoseResponseData,
	forest: generateErrorBarData, // Similar to error bar
	roc: generateROCData,
	// High-throughput, omics, and multivariate
	heatmap: generateHeatmapData,
	pca: generatePCAData,
	volcano: generateVolcanoData,
	'ma-plot': generateScatterPlotData, // Similar structure
	bubble: generateBubbleData,
	// Assay, plate, and lab operations
	'plate-layout': generateHeatmapData, // Similar to heatmap
	'control-chart': generateLineChartData, // Time series with control limits
	throughput: generateBarChartData, // Bar chart over time
	// Chemistry, bioprocess, and analytical
	chromatogram: generateChromatogramData,
	spectra: generateSpectraData,
	kinetics: generateKineticsData,
	'phase-diagram': generateScatterPlotData, // 2D phase space
	// Clinical, translational, and biomarker
	longitudinal: generateLongitudinalData,
	'kaplan-meier': generateLineChartData, // Survival curve
	demographic: generateBarChartData, // Stacked bars
	// Spatial, imaging, and maps
	'spatial-2d': generateHeatmapData, // 2D intensity map
	'spatial-3d': generateScatterPlotData, // 3D scatter (can be extended)
	geographic: generateScatterPlotData, // Lat/long scatter
	// Additional useful types
	pie: generatePieData,
	donut: generatePieData, // Similar to pie
	waterfall: generateBarChartData, // Sequential bars
	sankey: generateSankeyData,
	sunburst: generatePieData, // Hierarchical pie
	// Chemical compounds
	'structure-2d': generateStructure2DData,
	'structure-3d': generateProtein3DData, // Similar 3D visualization
	'reaction-scheme': generateStructure2DData, // Similar to 2D structure
	'chemical-space': generateChemicalSpaceData,
	'structure-activity-heatmap': generateHeatmapData, // Matrix heatmap
	'property-plot': generatePropertyPlotData,
	'similarity-network': generateChemicalSpaceData, // Network graph (simplified as scatter)
	'library-coverage': generateHistogramData, // Descriptor histograms
	'scaffold-breakdown': generateBarChartData, // Bar chart by scaffold
	'matched-pairs': generateStructure2DData, // Side-by-side structures
	// Proteins
	'protein-3d': generateProtein3DData,
	'domain-architecture': generateDomainArchitectureData,
	'protein-surface': generateProtein3DData, // 3D surface (similar to 3D structure)
	'binding-site': generateProtein3DData, // 3D binding site
	'protein-interaction': generateProtein3DData, // 3D protein complex
	'contact-map': generateContactMapData,
	'secondary-structure': generateDomainArchitectureData, // Linear track
	'disorder-profile': generateLineChartData, // Line plot along sequence
	'md-trajectory': generateLineChartData, // RMSD/RMSF time series
	// DNA/RNA sequences
	'genome-track': generateGenomeTrackData,
	'coverage-track': generateCoverageTrackData,
	'variant-lollipop': generateGenomeTrackData, // Similar to genome track
	'sequence-logo': generateSequenceLogoData,
	'gc-content': generateLineChartData, // Sliding window plot
	'motif-heatmap': generateHeatmapData, // Motif enrichment matrix
	'manhattan-plot': generateManhattanPlotData,
	'sashimi-plot': generateCoverageTrackData, // Coverage with splice junctions
	'assembly-graph': generateChemicalSpaceData, // Network graph (simplified)
};

export const getMockDataForChart = (chartType: ChartType): MockDataResult => {
	const generator = DATA_GENERATORS[chartType];
	return generator ? generator() : generateBarChartData(); // Fallback to bar chart
};

