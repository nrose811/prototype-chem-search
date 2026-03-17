import { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { HISTORICAL_DATA, HistoricalDataPoint } from '../mocks/demoData';
import './HistoricalComparisonChart.css';

interface HistoricalComparisonChartProps {
  analyte?: string;
  className?: string;
}

function HistoricalComparisonChart({ analyte, className }: HistoricalComparisonChartProps) {
  const filteredData = useMemo(() => {
    if (!analyte) return HISTORICAL_DATA;
    return HISTORICAL_DATA.filter((d) => d.analyte === analyte);
  }, [analyte]);

  // Group by analyte for separate traces
  const analytes = useMemo(() => {
    const set = new Set(filteredData.map((d) => d.analyte));
    return Array.from(set);
  }, [filteredData]);

  const traces = useMemo(() => {
    return analytes.flatMap((analyteName) => {
      const points = filteredData.filter((d) => d.analyte === analyteName);
      const historical = points.filter((d) => !d.isCurrent);
      const current = points.filter((d) => d.isCurrent);

      const traces: Partial<Plotly.PlotData>[] = [
        {
          x: historical.map((d) => d.date),
          y: historical.map((d) => d.result),
          type: 'scatter' as const,
          mode: 'markers' as const,
          name: `${analyteName} (Historical)`,
          marker: { size: 10, color: '#1976D2', opacity: 0.6 },
          text: historical.map((d) => `${d.batchId}: ${d.result}`),
          hovertemplate: '<b>%{text}</b><br>Date: %{x}<extra></extra>',
        },
        {
          x: current.map((d) => d.date),
          y: current.map((d) => d.result),
          type: 'scatter' as const,
          mode: 'markers' as const,
          name: `${analyteName} (Current Batch)`,
          marker: {
            size: 14,
            color: '#FF6B6B',
            symbol: 'diamond',
            line: { width: 2, color: '#c0392b' },
          },
          text: current.map((d) => `${d.batchId}: ${d.result}`),
          hovertemplate: '<b>%{text}</b><br>Date: %{x}<extra></extra>',
        },
      ];
      return traces;
    });
  }, [analytes, filteredData]);

  const layout: Partial<Plotly.Layout> = {
    title: { text: analyte
      ? `Historical Comparison: ${analyte}`
      : 'Historical Comparison: All Analytes' },
    xaxis: { title: { text: 'Date' }, type: 'date' },
    yaxis: { title: { text: 'Result' } },
    hovermode: 'closest',
    autosize: true,
    margin: { l: 60, r: 40, t: 50, b: 60 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      size: 12,
      color: '#1a1a2e',
    },
    legend: { orientation: 'h', y: -0.2 },
  };

  const config: Partial<Plotly.Config> = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'] as Plotly.ModeBarDefaultButtons[],
  };

  return (
    <div className={`historical-chart-container ${className || ''}`}>
      <Plot
        data={traces as Plotly.Data[]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
}

export default HistoricalComparisonChart;

