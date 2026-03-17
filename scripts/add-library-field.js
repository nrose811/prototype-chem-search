// Script to add library field to all chart configurations
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../packages/client/src/types/visualizations.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Define which library each chart type should use
const libraryMapping = {
	// Plotly for all statistical/analytical charts
	plotly: [
		'line', 'scatter', 'bar', 'box', 'violin', 'histogram',
		'error-bar', 'dose-response', 'forest', 'roc',
		'heatmap', 'pca', 'volcano', 'ma-plot', 'bubble',
		'plate-layout', 'control-chart', 'throughput',
		'chromatogram', 'spectra', 'kinetics', 'phase-diagram',
		'longitudinal', 'kaplan-meier', 'demographic',
		'spatial-2d', 'spatial-3d', 'geographic',
		'pie', 'donut', 'waterfall', 'sankey', 'sunburst',
		'library-coverage', 'scaffold-breakdown', 'property-plot',
		'gc-content', 'motif-heatmap', 'coverage-track'
	],
	// RDKit for chemical structures
	rdkit: [
		'structure-2d', 'reaction-scheme', 'chemical-space',
		'structure-activity-heatmap', 'similarity-network', 'matched-pairs'
	],
	// 3Dmol for 3D molecular structures
	'3dmol': [
		'structure-3d'
	],
	// Mol* for protein structures
	'mol-star': [
		'protein-3d', 'domain-architecture', 'protein-surface',
		'binding-site', 'protein-interaction', 'contact-map',
		'secondary-structure', 'disorder-profile', 'md-trajectory'
	],
	// IGV for genomics
	igv: [
		'genome-track', 'variant-lollipop', 'sequence-logo',
		'manhattan-plot', 'sashimi-plot', 'assembly-graph', 'circos'
	]
};

// Create reverse mapping
const chartToLibrary = {};
for (const [library, charts] of Object.entries(libraryMapping)) {
	for (const chart of charts) {
		chartToLibrary[chart] = library;
	}
}

// Add library field to each chart config
for (const [chartType, library] of Object.entries(chartToLibrary)) {
	// Match pattern: 'chartType': { ... category: '...',\n\t},
	const escapedChartType = chartType.replace(/[-]/g, '\\-');
	const regex = new RegExp(
		`('${escapedChartType}':\\s*\\{[\\s\\S]*?category:\\s*'[^']*',)\\s*\\n\\s*\\},`,
		'g'
	);

	content = content.replace(regex, (match, configContent) => {
		// Check if library field already exists
		if (match.includes('library:')) {
			return match;
		}
		// Add library field after category
		return configContent + `\n\t\tlibrary: '${library}',\n\t},`;
	});
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Added library field to all chart configurations');

