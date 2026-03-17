import type {ChartType} from '../types/visualizations';
import {CHART_CONFIGS} from '../types/visualizations';

/**
 * Detect the most appropriate chart type based on user input
 */
export const detectChartType = (userInput: string): ChartType | null => {
	const lowerInput = userInput.toLowerCase();

	// Score each chart type based on keyword matches
	const scores: {type: ChartType; score: number}[] = [];

	for (const [chartType, config] of Object.entries(CHART_CONFIGS)) {
		let score = 0;

		// Check for exact chart type name match
		if (lowerInput.includes(chartType)) {
			score += 10;
		}

		// Check for title match
		if (lowerInput.includes(config.title.toLowerCase())) {
			score += 8;
		}

		// Check for keyword matches
		for (const keyword of config.keywords) {
			if (lowerInput.includes(keyword.toLowerCase())) {
				score += 2;
			}
		}

		if (score > 0) {
			scores.push({type: chartType as ChartType, score});
		}
	}

	// Sort by score and return the highest
	scores.sort((a, b) => b.score - a.score);

	return scores.length > 0 ? scores[0].type : null;
};

/**
 * Generate a helpful response message based on the chart type
 */
export const generateChartResponse = (chartType: ChartType): string => {
	const config = CHART_CONFIGS[chartType];

	const responses: Record<string, string> = {
		line: "I've created a line chart showing your time-series data. This is perfect for tracking trends, stability studies, and temporal patterns.\n\nWould you like me to:\n• Add a trendline or moving average?\n• Highlight specific time periods?\n• Compare multiple series?",
		scatter:
			"Here's a scatter plot showing the relationship between your variables. I can see a correlation pattern in the data.\n\nI can help you:\n• Add a regression line with R² value?\n• Color points by category?\n• Identify and label outliers?",
		bar: "I've generated a bar chart for comparing your groups. This makes it easy to see differences at a glance.\n\nWould you like to:\n• Sort bars by value?\n• Add error bars for variability?\n• Change to a horizontal layout?",
		box: "Here's a box plot showing the distribution and variability of your measurements. You can see the median, quartiles, and any outliers.\n\nI can also:\n• Add individual data points?\n• Show mean with confidence intervals?\n• Compare across multiple groups?",
		violin:
			"I've created a violin plot that combines distribution density with statistical summary. This gives you a complete picture of your data spread.\n\nOptions:\n• Overlay box plot for reference?\n• Split by category?\n• Show individual observations?",
		histogram:
			"Here's a histogram showing the frequency distribution of your data. This helps identify the shape and spread of your measurements.\n\nWould you like to:\n• Adjust bin size?\n• Overlay a normal distribution curve?\n• Show cumulative distribution?",
		'error-bar':
			"I've created an error bar plot showing means with standard deviation. This is ideal for comparing treatment effects with statistical context.\n\nI can:\n• Add significance markers (*, **, ***)?\n• Change to SEM instead of SD?\n• Include individual data points?",
		'dose-response':
			"Here's a dose-response curve with sigmoidal fit. The EC50/IC50 value is calculated and displayed.\n\nOptions:\n• Overlay multiple compounds?\n• Show confidence intervals?\n• Display fit parameters?",
		roc: "I've generated an ROC curve showing your classifier's performance. The AUC (Area Under Curve) indicates overall accuracy.\n\nWould you like to:\n• Compare multiple models?\n• Show optimal threshold point?\n• Add confidence intervals?",
		heatmap:
			"Here's a heatmap visualization of your matrix data. Color intensity represents values, making patterns easy to spot.\n\nI can:\n• Add hierarchical clustering?\n• Adjust color scale?\n• Annotate cells with values?",
		pca: "I've created a PCA plot showing how your samples cluster in reduced dimensional space. Each axis shows the variance explained.\n\nOptions:\n• Show loadings/contributions?\n• Add 95% confidence ellipses?\n• Color by different groupings?",
		volcano:
			"Here's a volcano plot highlighting differentially expressed features. Significant changes are colored based on your thresholds.\n\nWould you like to:\n• Adjust fold-change and p-value cutoffs?\n• Label top hits?\n• Export significant features?",
		'ma-plot':
			"I've generated an MA plot showing average intensity vs fold change. This helps identify systematic biases in your data.\n\nI can:\n• Add loess smoothing?\n• Highlight specific features?\n• Show density contours?",
		bubble:
			"Here's a bubble plot displaying multiple dimensions simultaneously. Bubble size and color add extra information layers.\n\nOptions:\n• Adjust bubble size scaling?\n• Change color mapping?\n• Add labels to key points?",
		'plate-layout':
			"I've created a plate layout heatmap showing your well data. This makes it easy to spot spatial patterns or edge effects.\n\nWould you like to:\n• Flag control wells?\n• Highlight outliers?\n• Show multiple plates side-by-side?",
		'control-chart':
			"Here's a control chart (SPC) for monitoring your QC metrics over time. Control limits help identify out-of-spec measurements.\n\nI can:\n• Add warning limits (2σ)?\n• Show moving range?\n• Highlight rule violations?",
		throughput:
			"I've generated a throughput plot showing instrument utilization over time. This helps identify bottlenecks and capacity issues.\n\nOptions:\n• Stack by instrument type?\n• Show success/failure rates?\n• Add target throughput line?",
		chromatogram:
			"Here's a chromatogram showing signal intensity over retention time. Peaks are clearly visible for analysis.\n\nWould you like to:\n• Overlay multiple runs?\n• Annotate peak identities?\n• Show baseline correction?",
		spectra:
			"I've created a spectrum plot showing your spectroscopic data. Peaks and absorption patterns are clearly displayed.\n\nI can:\n• Overlay reference spectra?\n• Normalize intensities?\n• Mark characteristic peaks?",
		kinetics:
			"Here's a kinetics plot showing reaction progress. The curve fit helps determine rate constants.\n\nOptions:\n• Show Lineweaver-Burk transformation?\n• Add Arrhenius plot?\n• Display fit parameters?",
		'phase-diagram':
			"I've generated a phase diagram showing the relationship between temperature, pressure, or composition.\n\nWould you like to:\n• Add phase boundary lines?\n• Mark critical points?\n• Show tie lines?",
		longitudinal:
			"Here's a longitudinal plot tracking measurements over time for each subject. Individual trajectories are clearly visible.\n\nI can:\n• Add treatment epochs?\n• Show population mean?\n• Highlight specific subjects?",
		'kaplan-meier':
			"I've created a Kaplan-Meier survival curve showing time-to-event data. Censored observations are properly handled.\n\nOptions:\n• Add confidence intervals?\n• Show risk table?\n• Compare multiple arms with log-rank test?",
		demographic:
			"Here's a demographic plot summarizing your population characteristics. Distributions are clearly displayed.\n\nWould you like to:\n• Show as stacked bars?\n• Add percentage labels?\n• Compare across subgroups?",
		'spatial-2d':
			"I've created a 2D spatial map showing intensity or features across your tissue/sample. Spatial patterns are visible.\n\nI can:\n• Overlay cell boundaries?\n• Show multiple markers?\n• Add scale bar?",
		'spatial-3d':
			"Here's a 3D spatial visualization of your volumetric data. You can rotate and explore the structure.\n\nOptions:\n• Adjust opacity?\n• Show cross-sections?\n• Color by intensity?",
		geographic:
			"I've generated a geographic map showing your site locations and data. Regional patterns are easy to identify.\n\nWould you like to:\n• Add region boundaries?\n• Size markers by value?\n• Show heatmap overlay?",
		pie: "Here's a pie chart showing the proportional breakdown of your categories. Percentages are clearly labeled.\n\nI can:\n• Convert to donut chart?\n• Explode a slice?\n• Show as bar chart instead?",
		donut:
			"I've created a donut chart with space in the center for summary information. Proportions are easy to compare.\n\nOptions:\n• Add center label?\n• Show percentages?\n• Convert to pie chart?",
		waterfall:
			"Here's a waterfall chart showing the cumulative effect of sequential changes. Positive and negative contributions are clearly marked.\n\nWould you like to:\n• Add subtotals?\n• Color by category?\n• Show connector lines?",
		sankey:
			"I've generated a Sankey diagram showing flow between categories. The width of flows represents magnitude.\n\nI can:\n• Adjust node order?\n• Color by source/target?\n• Add flow labels?",
		sunburst:
			"Here's a sunburst chart showing your hierarchical data. Inner rings represent higher levels of the hierarchy.\n\nOptions:\n• Show percentages?\n• Adjust color scheme?\n• Enable drill-down?",
		// Chemical compounds
		'structure-2d':
			"I've rendered a 2D chemical structure showing atoms, bonds, and stereochemistry. This is perfect for visualizing molecular structures.\n\nWould you like to:\n• Highlight functional groups?\n• Show SMILES notation?\n• Display molecular properties (MW, LogP)?",
		'structure-3d':
			"Here's a 3D molecular structure with ball-and-stick representation. You can rotate and explore the conformer.\n\nOptions:\n• Switch to space-filling model?\n• Color by atom type or property?\n• Show hydrogen bonds?",
		'reaction-scheme':
			"I've created a reaction scheme showing reactants, products, and reagents. Stoichiometry and conditions are displayed.\n\nI can:\n• Add atom mapping?\n• Show mechanism arrows?\n• Include yield information?",
		'chemical-space':
			"Here's a chemical space map using t-SNE projection of molecular fingerprints. Compounds are colored by activity.\n\nWould you like to:\n• Try different dimensionality reduction (PCA, UMAP)?\n• Color by different properties?\n• Highlight specific compound series?",
		'structure-activity-heatmap':
			"I've generated a structure-activity heatmap showing compounds vs assays. Color intensity represents potency.\n\nOptions:\n• Cluster by similarity?\n• Show IC50 values?\n• Filter by activity threshold?",
		'property-plot':
			"Here's a property plot showing LogP vs Molecular Weight with Lipinski's Rule of 5 boundaries.\n\nI can:\n• Plot different properties (pKa, TPSA, HBD/HBA)?\n• Add drug-like space boundaries?\n• Show structure on hover?",
		'similarity-network':
			"I've created a similarity network where nodes are molecules and edges connect similar compounds (Tanimoto > 0.7).\n\nWould you like to:\n• Adjust similarity threshold?\n• Color by series or activity?\n• Show cluster labels?",
		'library-coverage':
			"Here's a library coverage plot showing distributions of key descriptors (MW, LogP, HBD/HBA, TPSA).\n\nOptions:\n• Compare to reference libraries?\n• Show diversity metrics?\n• Highlight outliers?",
		'scaffold-breakdown':
			"I've generated a scaffold breakdown showing compound counts by Bemis-Murcko scaffold.\n\nI can:\n• Show hit rates per scaffold?\n• Display scaffold structures?\n• Sort by count or activity?",
		'matched-pairs':
			"Here's a matched molecular pairs view showing side-by-side structures with property deltas.\n\nWould you like to:\n• Show transformation statistics?\n• Filter by property change?\n• Display confidence intervals?",
		// Proteins
		'protein-3d':
			"I've rendered a 3D protein structure with ribbon/cartoon representation. Secondary structure elements are clearly visible.\n\nOptions:\n• Switch to surface view?\n• Color by secondary structure or B-factor?\n• Show ligands or cofactors?",
		'domain-architecture':
			"Here's a domain architecture diagram showing domains, motifs, and signal peptides along the sequence.\n\nI can:\n• Add transmembrane predictions?\n• Show disorder regions?\n• Include PTM sites?",
		'protein-surface':
			"I've created a protein surface map colored by electrostatic potential. Charged regions are clearly marked.\n\nWould you like to:\n• Color by hydrophobicity?\n• Show conservation scores?\n• Highlight binding pockets?",
		'binding-site':
			"Here's a binding site visualization showing the ligand in the pocket with key residues and interactions.\n\nOptions:\n• Show hydrogen bonds and distances?\n• Display hydrophobic contacts?\n• Add water molecules?",
		'protein-interaction':
			"I've visualized the protein-protein interaction interface with complementary surfaces highlighted.\n\nI can:\n• Show interface residues?\n• Calculate buried surface area?\n• Highlight hot spots?",
		'contact-map':
			"Here's a contact map showing residue-residue distances. Diagonal patterns indicate secondary structure.\n\nWould you like to:\n• Adjust distance cutoff?\n• Show difference map?\n• Highlight specific regions?",
		'secondary-structure':
			"I've created a secondary structure plot showing helix/strand/coil along the sequence.\n\nOptions:\n• Overlay disorder predictions?\n• Show confidence scores?\n• Compare multiple structures?",
		'disorder-profile':
			"Here's a disorder profile showing per-residue flexibility and intrinsically disordered regions.\n\nI can:\n• Add hydrophobicity plot?\n• Show conservation?\n• Highlight functional motifs?",
		'md-trajectory':
			"I've generated MD trajectory analysis plots showing RMSD and RMSF over time.\n\nWould you like to:\n• Show distance/angle plots?\n• Display cluster analysis?\n• Add energy profiles?",
		// DNA/RNA sequences
		'genome-track':
			"Here's a genome track view showing genes, exons, and annotations along chromosomal coordinates.\n\nOptions:\n• Add variant tracks?\n• Show coverage data?\n• Include regulatory elements?",
		'coverage-track':
			"I've created a coverage track showing read depth across the region. This is useful for identifying gaps or duplications.\n\nI can:\n• Overlay multiple samples?\n• Show strand-specific coverage?\n• Add quality scores?",
		'variant-lollipop':
			"Here's a variant lollipop plot showing mutations along the sequence. Recurrent variants are clearly visible.\n\nWould you like to:\n• Color by variant type (SNP, indel)?\n• Show allele frequencies?\n• Highlight pathogenic variants?",
		'sequence-logo':
			"I've generated a sequence logo showing position-specific nucleotide frequencies. Conserved positions are prominent.\n\nOptions:\n• Adjust information content scale?\n• Show reverse complement?\n• Compare multiple motifs?",
		'gc-content':
			"Here's a GC content plot using a sliding window along the genome. This helps identify GC-rich or AT-rich regions.\n\nI can:\n• Adjust window size?\n• Show CpG islands?\n• Add gene annotations?",
		'motif-heatmap':
			"I've created a motif enrichment heatmap showing binding site occurrences across regions.\n\nWould you like to:\n• Cluster by motif similarity?\n• Show significance scores?\n• Filter by enrichment threshold?",
		'manhattan-plot':
			"Here's a Manhattan plot showing genome-wide association results. Significant loci are above the threshold line.\n\nOptions:\n• Add gene annotations?\n• Show LD blocks?\n• Highlight candidate genes?",
		'sashimi-plot':
			"I've generated a Sashimi plot showing exon coverage with splice junction arcs. Alternative splicing events are visible.\n\nI can:\n• Show junction read counts?\n• Compare across conditions?\n• Highlight novel junctions?",
		'assembly-graph':
			"Here's an assembly graph showing contigs and their connections. This helps visualize genome assembly complexity.\n\nWould you like to:\n• Color by coverage?\n• Show repeat regions?\n• Simplify the graph?",
		// Benchling integration
		'benchling-assay-scatter':
			"I'm fetching your assay results from Benchling and rendering a scatter plot of cell population frequencies over time.\n\nWould you like to:\n• Filter by specific population?\n• Adjust the date range?\n• Overlay a trendline?",
		'benchling-assay-bar':
			"Here's a bar chart showing average frequency per population from your Benchling assay data.\n\nOptions:\n• Sort bars by value?\n• Show individual data points?\n• Compare across assay schemas?",
		'benchling-inventory-timeline':
			"I've pulled your Benchling inventory and charted container creation by month. This shows how your inventory has grown over time.\n\nWould you like to:\n• Filter by container type?\n• Show cumulative total?\n• Break down by project?",
		'benchling-inventory-status':
			"Here's a pie chart of your Benchling containers by checkout status. You can see what's available vs. checked out at a glance.\n\nOptions:\n• Show as bar chart instead?\n• Filter by location?\n• Break down by container type?",
		'benchling-entries-author':
			"I've fetched your Benchling notebook entries and grouped them by author. This shows contribution patterns across your team.\n\nWould you like to:\n• Filter by date range?\n• Break down by project?\n• Show entries over time?",
		'benchling-entries-timeline':
			"Here's a timeline of your Benchling notebook entries by month. You can see experiment activity patterns clearly.\n\nOptions:\n• Show cumulative total?\n• Color by author?\n• Filter by entry type?",
		'benchling-dna-lengths':
			"I've pulled your Benchling DNA sequences and charted them by length in base pairs.\n\nWould you like to:\n• Filter by sequence type?\n• Show only annotated sequences?\n• Group by schema?",
		circos:
			"I've created a Circos plot showing genomic relationships in a circular layout. Links between regions are clearly displayed.\n\nOptions:\n• Add additional data tracks?\n• Adjust link transparency?\n• Show specific chromosomes?",
	};

	return responses[chartType] || `I've created a ${config.title} for your data. ${config.description}`;
};

