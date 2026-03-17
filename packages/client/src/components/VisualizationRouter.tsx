import type {ChartType} from '../types/visualizations';
import {CHART_CONFIGS} from '../types/visualizations';
import PlotlyChart from './PlotlyChart';
import ChemicalStructureViewer from './ChemicalStructureViewer';
import MolecularViewer from './MolecularViewer';
import ProteinViewer from './ProteinViewer';
import GenomeViewer from './GenomeViewer';
import type {MockDataResult} from '../utils/mockDataGenerators';

export interface VisualizationRouterProps {
	chartType: ChartType;
	title?: string;
	className?: string;
	realData?: MockDataResult;
}

/**
 * VisualizationRouter intelligently routes to the appropriate visualization library
 * based on the chart type's library field in CHART_CONFIGS.
 * 
 * Supported libraries:
 * - Plotly.js: Statistical and analytical charts
 * - RDKit.js: Chemical structures and chemical space analysis
 * - 3Dmol.js: 3D molecular structures
 * - Mol*: Protein structures and molecular biology
 * - IGV.js: Genomics visualizations
 */
const VisualizationRouter = ({chartType, title, className, realData}: VisualizationRouterProps) => {
	const config = CHART_CONFIGS[chartType];

	if (!config) {
		return (
			<div className="chart-error">
				Unknown chart type: {chartType}
			</div>
		);
	}

	// Route to the appropriate visualization library
	switch (config.library) {
		case 'plotly':
			return <PlotlyChart chartType={chartType} title={title} className={className} realData={realData} />;

		case 'rdkit':
			return <ChemicalStructureViewer chartType={chartType} title={title} className={className} />;

		case '3dmol':
			return <MolecularViewer chartType={chartType} title={title} className={className} />;

		case 'mol-star':
			return <ProteinViewer chartType={chartType} title={title} className={className} />;

		case 'igv':
			return <GenomeViewer chartType={chartType} title={title} className={className} />;

		default:
			// Fallback to Plotly for unknown libraries
			console.warn(`Unknown library: ${config.library}, falling back to Plotly`);
			return <PlotlyChart chartType={chartType} title={title} className={className} realData={realData} />;
	}
};

export default VisualizationRouter;

