/**
 * Simplified SVG-based chromatogram overlay chart.
 * Replaces react-plotly.js to keep the bundle small.
 */
import { useMemo } from 'react';
import { ChromatogramSeries } from '../mocks/demoData';

interface ChromatogramChartProps {
  series: ChromatogramSeries[];
  standard?: ChromatogramSeries;
  highlightLabel?: string | null;
}

const COLORS = ['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const W = 760;
const H = 320;
const PAD = { top: 20, right: 20, bottom: 50, left: 55 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

function toPath(time: number[], intensity: number[], xMin: number, xMax: number, yMax: number): string {
  const pts = time.map((t, i) => {
    const x = PAD.left + ((t - xMin) / (xMax - xMin)) * PW;
    const y = PAD.top + PH - (intensity[i] / yMax) * PH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M${pts.join('L')}`;
}

export default function ChromatogramChart({ series, standard, highlightLabel }: ChromatogramChartProps) {
  const { xMin, xMax, yMax } = useMemo(() => {
    const all = standard ? [standard, ...series] : series;
    let mn = Infinity, mx = -Infinity, ym = 0;
    for (const s of all) {
      for (let i = 0; i < s.time.length; i++) {
        if (s.time[i] < mn) mn = s.time[i];
        if (s.time[i] > mx) mx = s.time[i];
        if (s.intensity[i] > ym) ym = s.intensity[i];
      }
    }
    return { xMin: mn, xMax: mx, yMax: ym * 1.1 };
  }, [series, standard]);

  // Axis ticks
  const xTicks = useMemo(() => {
    const step = 5;
    const ticks: number[] = [];
    for (let v = Math.ceil(xMin / step) * step; v <= xMax; v += step) ticks.push(v);
    return ticks;
  }, [xMin, xMax]);

  const yTicks = useMemo(() => {
    const step = Math.pow(10, Math.floor(Math.log10(yMax))) / 2 || 100;
    const ticks: number[] = [];
    for (let v = 0; v <= yMax; v += step) ticks.push(v);
    return ticks;
  }, [yMax]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', maxHeight: 360, display: 'block' }}>
      {/* Grid lines */}
      {yTicks.map((v) => {
        const y = PAD.top + PH - (v / yMax) * PH;
        return <line key={`yg-${v}`} x1={PAD.left} x2={PAD.left + PW} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={0.5} />;
      })}

      {/* Axes */}
      <line x1={PAD.left} x2={PAD.left + PW} y1={PAD.top + PH} y2={PAD.top + PH} stroke="#9ca3af" strokeWidth={1} />
      <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + PH} stroke="#9ca3af" strokeWidth={1} />

      {/* X ticks / labels */}
      {xTicks.map((v) => {
        const x = PAD.left + ((v - xMin) / (xMax - xMin)) * PW;
        return (
          <g key={`xt-${v}`}>
            <line x1={x} x2={x} y1={PAD.top + PH} y2={PAD.top + PH + 5} stroke="#9ca3af" />
            <text x={x} y={PAD.top + PH + 18} textAnchor="middle" fontSize={10} fill="#6b7280">{v}</text>
          </g>
        );
      })}

      {/* Y ticks / labels */}
      {yTicks.map((v) => {
        const y = PAD.top + PH - (v / yMax) * PH;
        return (
          <g key={`yt-${v}`}>
            <line x1={PAD.left - 5} x2={PAD.left} y1={y} y2={y} stroke="#9ca3af" />
            <text x={PAD.left - 8} y={y + 3} textAnchor="end" fontSize={10} fill="#6b7280">{v.toFixed(0)}</text>
          </g>
        );
      })}

      {/* Axis titles */}
      <text x={PAD.left + PW / 2} y={H - 5} textAnchor="middle" fontSize={11} fill="#374151">Time (min)</text>
      <text x={14} y={PAD.top + PH / 2} textAnchor="middle" fontSize={11} fill="#374151" transform={`rotate(-90,14,${PAD.top + PH / 2})`}>Intensity (mAU)</text>

      {/* Standard reference */}
      {standard && (
        <path d={toPath(standard.time, standard.intensity, xMin, xMax, yMax)} fill="none" stroke="#9ca3af" strokeWidth={1.2} strokeDasharray="6 3" opacity={0.7} />
      )}

      {/* Sample traces */}
      {series.map((s, idx) => {
        const isHighlighted = highlightLabel === s.label;
        const dimmed = highlightLabel && !isHighlighted;
        return (
          <path
            key={s.label}
            d={toPath(s.time, s.intensity, xMin, xMax, yMax)}
            fill="none"
            stroke={COLORS[idx % COLORS.length]}
            strokeWidth={isHighlighted ? 2.5 : 1.3}
            opacity={dimmed ? 0.2 : 1}
          />
        );
      })}

      {/* Legend */}
      {[...(standard ? [{ label: standard.label, color: '#9ca3af', dash: true }] : []), ...series.map((s, i) => ({ label: s.label, color: COLORS[i % COLORS.length], dash: false }))].map((item, i) => {
        const lx = PAD.left + 10 + (i % 4) * 180;
        const ly = H - 30 + Math.floor(i / 4) * 14;
        return (
          <g key={item.label}>
            <line x1={lx} x2={lx + 16} y1={ly} y2={ly} stroke={item.color} strokeWidth={item.dash ? 1.2 : 1.5} strokeDasharray={item.dash ? '4 2' : 'none'} />
            <text x={lx + 20} y={ly + 3} fontSize={9} fill="#374151">{item.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

