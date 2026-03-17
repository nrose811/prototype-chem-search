import {useEffect, useRef, useState} from 'react';
import Plot from 'react-plotly.js';
import type {ChartType} from '../types/visualizations';
import {getMockDataForChart} from '../utils/mockDataGenerators';
import type {MockDataResult} from '../utils/mockDataGenerators';
import './PlotlyChart.css';

interface PlotlyChartProps {
	chartType: ChartType;
	title?: string;
	className?: string;
	realData?: MockDataResult;
}

export const PlotlyChart = ({chartType, title, className, realData}: PlotlyChartProps) => {
	const [chartData, setChartData] = useState<any>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Use real data if provided, otherwise generate mock data
		const data = realData ?? getMockDataForChart(chartType);
		setChartData(data);
	}, [chartType, realData]);

	if (!chartData) {
		return (
			<div className={`plotly-chart-container ${className || ''}`}>
				<div className="plotly-chart-loading">Loading chart...</div>
			</div>
		);
	}

	// Override title if provided
	const layout = {
		...chartData.layout,
		...(title && {title}),
		autosize: true,
		margin: {l: 60, r: 40, t: 60, b: 60},
		paper_bgcolor: 'rgba(0,0,0,0)',
		plot_bgcolor: 'rgba(0,0,0,0)',
		font: {
			family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			size: 12,
			color: '#1a1a2e',
		},
	};

	const config = {
		responsive: true,
		displayModeBar: true,
		displaylogo: false,
		modeBarButtonsToRemove: ['lasso2d', 'select2d'],
		toImageButtonOptions: {
			format: 'png',
			filename: `chart_${chartType}_${Date.now()}`,
			height: 800,
			width: 1200,
			scale: 2,
		},
		...chartData.config,
	};

	return (
		<div ref={containerRef} className={`plotly-chart-container ${className || ''}`}>
			<Plot
				data={chartData.data}
				layout={layout}
				config={config}
				style={{width: '100%', height: '100%'}}
				useResizeHandler={true}
			/>
		</div>
	);
};

export default PlotlyChart;

