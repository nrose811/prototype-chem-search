// Visualization library types
export type VisualizationLibrary = 'plotly' | 'rdkit' | 'mol-star' | 'igv' | '3dmol';

export type ChartType =
	// Core workhorse plots
	| 'line'
	| 'scatter'
	| 'bar'
	| 'box'
	| 'violin'
	| 'histogram'
	// Experimental design and statistics
	| 'error-bar'
	| 'dose-response'
	| 'forest'
	| 'roc'
	// High-throughput, omics, and multivariate
	| 'heatmap'
	| 'pca'
	| 'volcano'
	| 'ma-plot'
	| 'bubble'
	// Assay, plate, and lab operations
	| 'plate-layout'
	| 'control-chart'
	| 'throughput'
	// Chemistry, bioprocess, and analytical
	| 'chromatogram'
	| 'spectra'
	| 'kinetics'
	| 'phase-diagram'
	// Clinical, translational, and biomarker
	| 'longitudinal'
	| 'kaplan-meier'
	| 'demographic'
	// Spatial, imaging, and maps
	| 'spatial-2d'
	| 'spatial-3d'
	| 'geographic'
	// Additional useful types
	| 'pie'
	| 'donut'
	| 'waterfall'
	| 'sankey'
	| 'sunburst'
	// Chemical compounds
	| 'structure-2d'
	| 'structure-3d'
	| 'reaction-scheme'
	| 'chemical-space'
	| 'structure-activity-heatmap'
	| 'property-plot'
	| 'similarity-network'
	| 'library-coverage'
	| 'scaffold-breakdown'
	| 'matched-pairs'
	// Proteins
	| 'protein-3d'
	| 'domain-architecture'
	| 'protein-surface'
	| 'binding-site'
	| 'protein-interaction'
	| 'contact-map'
	| 'secondary-structure'
	| 'disorder-profile'
	| 'md-trajectory'
	// DNA/RNA sequences
	| 'genome-track'
	| 'coverage-track'
	| 'variant-lollipop'
	| 'sequence-logo'
	| 'gc-content'
	| 'motif-heatmap'
	| 'manhattan-plot'
	| 'sashimi-plot'
	| 'assembly-graph'
	// Benchling integration
	| 'benchling-assay-scatter'
	| 'benchling-assay-bar'
	| 'benchling-inventory-timeline'
	| 'benchling-inventory-status'
	| 'benchling-entries-author'
	| 'benchling-entries-timeline'
	| 'benchling-dna-lengths';

export interface ChartConfig {
	type: ChartType;
	title: string;
	description: string;
	keywords: string[];
	category: 'core' | 'experimental' | 'omics' | 'assay' | 'chemistry' | 'clinical' | 'spatial' | 'other' | 'benchling';
	library: VisualizationLibrary;
}

export const CHART_CONFIGS: Record<ChartType, ChartConfig> = {
	// Core workhorse plots
	line: {
		type: 'line',
		title: 'Line Chart',
		description: 'Time courses, stability studies, sensor traces, chromatography traces',
		keywords: ['time', 'trend', 'course', 'stability', 'trace', 'sensor', 'drift', 'profile', 'temporal'],
		category: 'core',
		library: 'plotly',
	},
	scatter: {
		type: 'scatter',
		title: 'Scatter Plot',
		description: 'Calibration curves, method linearity, correlation, concentration vs response',
		keywords: ['correlation', 'relationship', 'calibration', 'linearity', 'concentration', 'response', 'replicate'],
		category: 'core',
		library: 'plotly',
	},
	bar: {
		type: 'bar',
		title: 'Bar Chart',
		description: 'Group comparisons, batch means, KPIs, categorical summaries',
		keywords: ['compare', 'comparison', 'group', 'batch', 'category', 'count', 'kpi', 'summary'],
		category: 'core',
		library: 'plotly',
	},
	box: {
		type: 'box',
		title: 'Box Plot',
		description: 'Distribution of measurements, assay variability, method comparison',
		keywords: ['distribution', 'variability', 'replicate', 'quartile', 'outlier', 'spread', 'median'],
		category: 'core',
		library: 'plotly',
	},
	violin: {
		type: 'violin',
		title: 'Violin Plot',
		description: 'Distribution density with statistical summary',
		keywords: ['distribution', 'density', 'variability', 'spread', 'violin'],
		category: 'core',
		library: 'plotly',
	},
	histogram: {
		type: 'histogram',
		title: 'Histogram',
		description: 'Signal distributions, background noise, QC metrics, LOD/LOQ',
		keywords: ['distribution', 'frequency', 'histogram', 'noise', 'qc', 'lod', 'loq'],
		category: 'core',
		library: 'plotly',
	},
	// Experimental design and statistics
	'error-bar': {
		type: 'error-bar',
		title: 'Error Bar Plot',
		description: 'Mean ± SD/SEM by condition with significance annotations',
		keywords: ['error', 'standard deviation', 'sem', 'mean', 'significance', 'endpoint'],
		category: 'experimental',
		library: 'plotly',
	},
	'dose-response': {
		type: 'dose-response',
		title: 'Dose-Response Curve',
		description: 'Sigmoidal fit with EC50/IC50',
		keywords: ['dose', 'response', 'ec50', 'ic50', 'sigmoidal', 'curve', 'compound'],
		category: 'experimental',
		library: 'plotly',
	},
	forest: {
		type: 'forest',
		title: 'Forest Plot',
		description: 'Effect sizes and confidence intervals',
		keywords: ['forest', 'effect size', 'confidence interval', 'meta-analysis', 'clinical'],
		category: 'experimental',
		library: 'plotly',
	},
	roc: {
		type: 'roc',
		title: 'ROC Curve',
		description: 'Classification performance, sensitivity vs specificity, AUC',
		keywords: ['roc', 'auc', 'sensitivity', 'specificity', 'classification', 'performance'],
		category: 'experimental',
		library: 'plotly',
	},
	// High-throughput, omics, and multivariate
	heatmap: {
		type: 'heatmap',
		title: 'Heatmap',
		description: 'Plate maps, expression matrices, metabolomics intensity',
		keywords: ['heatmap', 'plate', 'expression', 'matrix', 'intensity', 'cluster', 'metabolomics'],
		category: 'omics',
		library: 'plotly',
	},
	pca: {
		type: 'pca',
		title: 'PCA Plot',
		description: 'Sample clustering by expression profile, dimensionality reduction',
		keywords: ['pca', 'principal component', 'clustering', 'dimensionality', 'multivariate'],
		category: 'omics',
		library: 'plotly',
	},
	volcano: {
		type: 'volcano',
		title: 'Volcano Plot',
		description: 'Differential expression (effect size vs significance)',
		keywords: ['volcano', 'differential', 'expression', 'fold change', 'p-value', 'significance'],
		category: 'omics',
		library: 'plotly',
	},
	'ma-plot': {
		type: 'ma-plot',
		title: 'MA Plot',
		description: 'Average intensity vs fold change for omics assays',
		keywords: ['ma plot', 'average', 'intensity', 'fold change', 'omics'],
		category: 'omics',
		library: 'plotly',
	},
	bubble: {
		type: 'bubble',
		title: 'Bubble Plot',
		description: '3-4D displays (pathway vs enrichment vs p-value)',
		keywords: ['bubble', '3d', '4d', 'pathway', 'enrichment', 'multi-dimensional'],
		category: 'omics',
		library: 'plotly',
	},
	// Assay, plate, and lab operations
	'plate-layout': {
		type: 'plate-layout',
		title: 'Plate Layout',
		description: '2D well maps (96/384/etc) showing signal or flags per well',
		keywords: ['plate', 'well', 'layout', '96', '384', 'microplate', 'assay'],
		category: 'assay',
		library: 'plotly',
	},
	'control-chart': {
		type: 'control-chart',
		title: 'Control Chart (SPC)',
		description: 'Levey-Jennings, CUSUM, moving range for QC metrics',
		keywords: ['control chart', 'spc', 'levey-jennings', 'cusum', 'qc', 'quality control'],
		category: 'assay',
		library: 'plotly',
	},
	throughput: {
		type: 'throughput',
		title: 'Throughput Plot',
		description: 'Jobs per instrument over time, queue lengths, success/failure rates',
		keywords: ['throughput', 'instrument', 'queue', 'utilization', 'jobs', 'performance'],
		category: 'assay',
		library: 'plotly',
	},
	// Chemistry, bioprocess, and analytical
	chromatogram: {
		type: 'chromatogram',
		title: 'Chromatogram',
		description: 'Signal vs time, peak overlays, comparison across runs',
		keywords: ['chromatogram', 'chromatography', 'peak', 'retention time', 'hplc', 'gc'],
		category: 'chemistry',
		library: 'plotly',
	},
	spectra: {
		type: 'spectra',
		title: 'Spectra',
		description: 'UV-Vis/IR/NMR/MS spectra, overlays, peak picking',
		keywords: ['spectra', 'spectrum', 'uv', 'ir', 'nmr', 'ms', 'mass spec', 'wavelength'],
		category: 'chemistry',
		library: 'plotly',
	},
	kinetics: {
		type: 'kinetics',
		title: 'Kinetics Plot',
		description: 'Reaction progress, Arrhenius plots, Michaelis-Menten',
		keywords: ['kinetics', 'reaction', 'arrhenius', 'michaelis', 'menten', 'enzyme', 'rate'],
		category: 'chemistry',
		library: 'plotly',
	},
	'phase-diagram': {
		type: 'phase-diagram',
		title: 'Phase Diagram',
		description: 'Temperature-composition, pressure-temperature, solubility curves',
		keywords: ['phase', 'diagram', 'temperature', 'pressure', 'solubility', 'composition'],
		category: 'chemistry',
		library: 'plotly',
	},
	// Clinical, translational, and biomarker
	longitudinal: {
		type: 'longitudinal',
		title: 'Longitudinal Plot',
		description: 'Per-subject biomarker or lab value over time',
		keywords: ['longitudinal', 'subject', 'biomarker', 'patient', 'visit', 'time course'],
		category: 'clinical',
		library: 'plotly',
	},
	'kaplan-meier': {
		type: 'kaplan-meier',
		title: 'Kaplan-Meier Curve',
		description: 'Time-to-event survival by arm or subgroup',
		keywords: ['kaplan', 'meier', 'survival', 'time to event', 'censored', 'clinical trial'],
		category: 'clinical',
		library: 'plotly',
	},
	demographic: {
		type: 'demographic',
		title: 'Demographic Plot',
		description: 'Stacked bars or mosaics of age, sex, race, comorbidities',
		keywords: ['demographic', 'population', 'age', 'sex', 'race', 'baseline', 'characteristics'],
		category: 'clinical',
		library: 'plotly',
	},
	// Spatial, imaging, and maps
	'spatial-2d': {
		type: 'spatial-2d',
		title: '2D Spatial Map',
		description: 'Microscopy features, spatial transcriptomics, tissue regions',
		keywords: ['spatial', '2d', 'microscopy', 'imaging', 'tissue', 'transcriptomics', 'roi'],
		category: 'spatial',
		library: 'plotly',
	},
	'spatial-3d': {
		type: 'spatial-3d',
		title: '3D Spatial Map',
		description: '3D intensity maps, volumetric data',
		keywords: ['spatial', '3d', 'volumetric', 'imaging', 'confocal'],
		category: 'spatial',
		library: 'plotly',
	},
	geographic: {
		type: 'geographic',
		title: 'Geographic Map',
		description: 'Site performance, enrollment by region, environmental sampling',
		keywords: ['geographic', 'map', 'site', 'location', 'region', 'enrollment', 'geo'],
		category: 'spatial',
		library: 'plotly',
	},
	// Additional useful types
	pie: {
		type: 'pie',
		title: 'Pie Chart',
		description: 'Proportions and percentages',
		keywords: ['pie', 'proportion', 'percentage', 'share', 'composition'],
		category: 'other',
		library: 'plotly',
	},
	donut: {
		type: 'donut',
		title: 'Donut Chart',
		description: 'Proportions with center space for additional info',
		keywords: ['donut', 'proportion', 'percentage', 'ring'],
		category: 'other',
		library: 'plotly',
	},
	waterfall: {
		type: 'waterfall',
		title: 'Waterfall Chart',
		description: 'Cumulative effect of sequential values',
		keywords: ['waterfall', 'cumulative', 'sequential', 'bridge'],
		category: 'other',
		library: 'plotly',
	},
	sankey: {
		type: 'sankey',
		title: 'Sankey Diagram',
		description: 'Flow and relationships between categories',
		keywords: ['sankey', 'flow', 'alluvial', 'pathway', 'network'],
		category: 'other',
		library: 'plotly',
	},
	sunburst: {
		type: 'sunburst',
		title: 'Sunburst Chart',
		description: 'Hierarchical data visualization',
		keywords: ['sunburst', 'hierarchical', 'radial', 'tree', 'nested'],
		category: 'other',
		library: 'plotly',
	},
	// Chemical compounds
	'structure-2d': {
		type: 'structure-2d',
		title: '2D Chemical Structure',
		description: 'Standard chemical drawings with atoms, bonds, stereochemistry',
		keywords: ['2d structure', 'chemical structure', 'molecule', 'compound', 'smiles', 'drawing'],
		category: 'chemistry',
		library: 'rdkit',
	},
	'structure-3d': {
		type: 'structure-3d',
		title: '3D Molecular Structure',
		description: 'Ball-and-stick, space-filling, surface renderings',
		keywords: ['3d molecular', '3d molecule', 'molecular structure', 'conformer', 'ball and stick', 'space filling', 'molecular model', '3d chemical', 'molecule 3d'],
		category: 'chemistry',
		library: '3dmol',
	},
	'reaction-scheme': {
		type: 'reaction-scheme',
		title: 'Reaction Scheme',
		description: 'Multi-step reactions with reactants, products, reagents',
		keywords: ['reaction', 'scheme', 'synthesis', 'reagent', 'stoichiometry', 'mechanism'],
		category: 'chemistry',
		library: 'rdkit',
	},
	'chemical-space': {
		type: 'chemical-space',
		title: 'Chemical Space Map',
		description: 'PCA/t-SNE/UMAP on fingerprints, colored by activity',
		keywords: ['chemical space', 'fingerprint', 'tsne', 'umap', 'compound clustering'],
		category: 'chemistry',
		library: 'rdkit',
	},
	'structure-activity-heatmap': {
		type: 'structure-activity-heatmap',
		title: 'Structure-Activity Heatmap',
		description: 'Compounds vs assays matrix colored by potency',
		keywords: ['structure activity', 'sar', 'potency', 'activity matrix', 'compound screening'],
		category: 'chemistry',
		library: 'rdkit',
	},
	'property-plot': {
		type: 'property-plot',
		title: 'Property vs Property Plot',
		description: 'LogP vs MW, pKa vs solubility, permeability plots',
		keywords: ['property', 'logp', 'molecular weight', 'pka', 'solubility', 'adme', 'lipinski'],
		category: 'chemistry',
		library: 'plotly',
	},
	'similarity-network': {
		type: 'similarity-network',
		title: 'Similarity Network',
		description: 'Graph where nodes are molecules, edges connect similar compounds',
		keywords: ['similarity', 'network', 'tanimoto', 'molecular graph', 'compound network'],
		category: 'chemistry',
		library: 'rdkit',
	},
	'library-coverage': {
		type: 'library-coverage',
		title: 'Library Coverage Plot',
		description: 'Histograms of key descriptors (MW, logP, HBD/HBA, TPSA)',
		keywords: ['library', 'coverage', 'descriptor', 'diversity', 'compound library'],
		category: 'chemistry',
		library: 'plotly',
	},
	'scaffold-breakdown': {
		type: 'scaffold-breakdown',
		title: 'Scaffold Breakdown',
		description: 'Bar charts showing counts by Bemis-Murcko scaffold',
		keywords: ['scaffold', 'bemis murcko', 'chemotype', 'series', 'core structure'],
		category: 'chemistry',
		library: 'plotly',
	},
	'matched-pairs': {
		type: 'matched-pairs',
		title: 'Matched Molecular Pairs',
		description: 'Side-by-side structures with property deltas',
		keywords: ['matched pairs', 'mmp', 'transformation', 'property delta', 'sar analysis'],
		category: 'chemistry',
		library: 'rdkit',
	},
	// Proteins
	'protein-3d': {
		type: 'protein-3d',
		title: '3D Protein Structure',
		description: 'Ribbon/cartoon, surface, backbone views of protein structure',
		keywords: ['protein structure', '3d protein', 'protein 3d', 'ribbon', 'cartoon', 'pdb', 'tertiary structure', 'protein model'],
		category: 'omics',
		library: 'mol-star',
	},
	'domain-architecture': {
		type: 'domain-architecture',
		title: 'Domain Architecture',
		description: 'Linear diagrams of domains, motifs, signal peptides',
		keywords: ['domain', 'architecture', 'motif', 'pfam', 'signal peptide', 'transmembrane'],
		category: 'omics',
		library: 'mol-star',
	},
	'protein-surface': {
		type: 'protein-surface',
		title: 'Protein Surface Map',
		description: 'Surface colored by charge, hydrophobicity, conservation',
		keywords: ['protein surface', 'electrostatic', 'hydrophobicity', 'conservation', 'surface property'],
		category: 'omics',
		library: 'mol-star',
	},
	'binding-site': {
		type: 'binding-site',
		title: 'Binding Site Visualization',
		description: 'Ligand in pocket with residues, H-bonds, contacts',
		keywords: ['binding site', 'ligand', 'pocket', 'docking', 'interaction', 'active site'],
		category: 'omics',
		library: 'mol-star',
	},
	'protein-interaction': {
		type: 'protein-interaction',
		title: 'Protein-Protein Interaction',
		description: 'Interface surfaces with complementary properties',
		keywords: ['protein interaction', 'ppi', 'interface', 'complex', 'binding interface'],
		category: 'omics',
		library: 'mol-star',
	},
	'contact-map': {
		type: 'contact-map',
		title: 'Contact Map',
		description: '2D matrix showing residue-residue distances/contacts',
		keywords: ['contact map', 'residue contact', 'distance matrix', 'protein contacts'],
		category: 'omics',
		library: 'mol-star',
	},
	'secondary-structure': {
		type: 'secondary-structure',
		title: 'Secondary Structure Plot',
		description: 'Track of helix/strand/coil along sequence',
		keywords: ['secondary structure', 'helix', 'strand', 'coil', 'dssp', 'structure prediction'],
		category: 'omics',
		library: 'mol-star',
	},
	'disorder-profile': {
		type: 'disorder-profile',
		title: 'Disorder Profile',
		description: 'Per-residue disorder, flexibility, hydrophobicity profiles',
		keywords: ['disorder', 'flexibility', 'idr', 'intrinsically disordered', 'hydrophobicity'],
		category: 'omics',
		library: 'mol-star',
	},
	'md-trajectory': {
		type: 'md-trajectory',
		title: 'MD Trajectory Analysis',
		description: 'RMSD, RMSF, distance/time plots from molecular dynamics',
		keywords: ['molecular dynamics', 'md', 'rmsd', 'rmsf', 'trajectory', 'simulation'],
		category: 'omics',
		library: 'mol-star',
	},
	// DNA/RNA sequences
	'genome-track': {
		type: 'genome-track',
		title: 'Genome Track',
		description: 'Linear tracks showing genes, exons, variants, annotations',
		keywords: ['genome browser', 'genome track', 'genomic track', 'igv', 'gene track', 'exon', 'variant', 'annotation', 'chromosome browser'],
		category: 'omics',
		library: 'igv',
	},
	'coverage-track': {
		type: 'coverage-track',
		title: 'Coverage Track',
		description: 'Read depth, ChIP-seq, ATAC-seq signal across regions',
		keywords: ['coverage', 'read depth', 'chip-seq', 'atac-seq', 'sequencing', 'signal'],
		category: 'omics',
		library: 'plotly',
	},
	'variant-lollipop': {
		type: 'variant-lollipop',
		title: 'Variant Lollipop Plot',
		description: 'Mutations or motifs as lollipops on sequence axis',
		keywords: ['variant', 'lollipop', 'mutation', 'snp', 'indel', 'variant plot'],
		category: 'omics',
		library: 'igv',
	},
	'sequence-logo': {
		type: 'sequence-logo',
		title: 'Sequence Logo',
		description: 'Position-specific nucleotide/amino-acid frequencies',
		keywords: ['sequence logo', 'motif', 'pwm', 'consensus', 'weblogo'],
		category: 'omics',
		library: 'igv',
	},
	'gc-content': {
		type: 'gc-content',
		title: 'GC Content Plot',
		description: 'Sliding-window GC content along genome/amplicon',
		keywords: ['gc content', 'at content', 'composition', 'nucleotide', 'genome composition'],
		category: 'omics',
		library: 'plotly',
	},
	'motif-heatmap': {
		type: 'motif-heatmap',
		title: 'Motif Heatmap',
		description: 'Enrichment of motifs across regions or samples',
		keywords: ['motif', 'enrichment', 'binding site', 'tfbs', 'motif analysis'],
		category: 'omics',
		library: 'plotly',
	},
	'manhattan-plot': {
		type: 'manhattan-plot',
		title: 'Manhattan Plot',
		description: 'Significance of variants across chromosomes for GWAS',
		keywords: ['manhattan', 'gwas', 'genome wide', 'association', 'snp', 'p-value'],
		category: 'omics',
		library: 'igv',
	},
	'sashimi-plot': {
		type: 'sashimi-plot',
		title: 'Sashimi Plot',
		description: 'Exon coverage with arcs for splice junctions',
		keywords: ['sashimi', 'splice', 'junction', 'rna-seq', 'alternative splicing', 'isoform'],
		category: 'omics',
		library: 'igv',
	},
	'assembly-graph': {
		type: 'assembly-graph',
		title: 'Assembly Graph',
		description: 'Node-edge graphs for contigs/transcripts',
		keywords: ['assembly', 'graph', 'contig', 'de bruijn', 'transcript assembly'],
		category: 'omics',
		library: 'igv',
	},
	// Benchling integration
	'benchling-assay-scatter': {
		type: 'benchling-assay-scatter',
		title: 'Benchling Assay Scatter',
		description: 'Scatter plot of assay results from Benchling, colored by population',
		keywords: ['assay', 'assay results', 'flowjo', 'cell population', 'frequency', 'benchling assay', 'assay scatter', 'benchling frequency'],
		category: 'benchling',
		library: 'plotly',
	},
	'benchling-assay-bar': {
		type: 'benchling-assay-bar',
		title: 'Benchling Assay Bar',
		description: 'Bar chart of average assay results by population from Benchling',
		keywords: ['assay bar', 'assay average', 'population frequency', 'assay summary', 'benchling bar', 'assay comparison'],
		category: 'benchling',
		library: 'plotly',
	},
	'benchling-inventory-timeline': {
		type: 'benchling-inventory-timeline',
		title: 'Benchling Inventory Timeline',
		description: 'Timeline of containers created in Benchling inventory',
		keywords: ['inventory', 'container', 'containers', 'benchling inventory', 'inventory timeline', 'inventory trend', 'well plate'],
		category: 'benchling',
		library: 'plotly',
	},
	'benchling-inventory-status': {
		type: 'benchling-inventory-status',
		title: 'Benchling Inventory Status',
		description: 'Pie chart showing Benchling container checkout status',
		keywords: ['container status', 'inventory status', 'checkout', 'available', 'benchling containers', 'inventory availability'],
		category: 'benchling',
		library: 'plotly',
	},
	'benchling-entries-author': {
		type: 'benchling-entries-author',
		title: 'Benchling Entries by Author',
		description: 'Bar chart of notebook entries grouped by author in Benchling',
		keywords: ['notebook', 'notebook entries', 'entries by author', 'author', 'benchling notebook', 'lab notebook', 'experiment entries'],
		category: 'benchling',
		library: 'plotly',
	},
	'benchling-entries-timeline': {
		type: 'benchling-entries-timeline',
		title: 'Benchling Entries Timeline',
		description: 'Timeline of notebook entries created in Benchling',
		keywords: ['notebook timeline', 'entries timeline', 'notebook history', 'benchling entries', 'experiment timeline', 'entry history'],
		category: 'benchling',
		library: 'plotly',
	},
	'benchling-dna-lengths': {
		type: 'benchling-dna-lengths',
		title: 'Benchling DNA Lengths',
		description: 'Bar chart of DNA sequence lengths from Benchling registry',
		keywords: ['dna sequences', 'dna length', 'sequence length', 'base pairs', 'benchling dna', 'benchling sequences', 'dna registry'],
		category: 'benchling',
		library: 'plotly',
	},
};

