import { useState } from 'react';
import './DashboardsPage.css';

// Icon components
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

interface Dashboard {
  id: string;
  name: string;
  createdAt: string;
}

interface Widget {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'metric';
  title: string;
  data: { label: string; value: number }[];
}

const chartColors = {
  primary: '#1976D2',
  secondary: '#42A5F5',
  tertiary: '#64B5F6',
  quaternary: '#90CAF9',
  quinary: '#BBDEFB',
};

function DashboardsPage() {
  const [dashboards] = useState<Dashboard[]>([
    { id: '1', name: 'Pipeline analytics', createdAt: '2 days ago' },
    { id: '2', name: 'Sample metrics', createdAt: 'Last week' },
    { id: '3', name: 'Experiment overview', createdAt: 'Last month' },
  ]);
  
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard>(dashboards[0]);
  const [showDashboardMenu, setShowDashboardMenu] = useState(false);
  const [showNewDashboardModal, setShowNewDashboardModal] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');

  const [widgets] = useState<Widget[]>([
    {
      id: '1',
      type: 'bar',
      title: 'Pipeline executions by organization',
      data: [
        { label: 'Acme Labs', value: 1250 },
        { label: 'BioTech Inc', value: 980 },
        { label: 'GeneCorp', value: 1100 },
        { label: 'MedResearch', value: 750 },
        { label: 'PharmaCo', value: 890 },
      ],
    },
    {
      id: '2',
      type: 'line',
      title: 'Data processing trend (last 7 days)',
      data: [
        { label: 'Mon', value: 245 },
        { label: 'Tue', value: 312 },
        { label: 'Wed', value: 287 },
        { label: 'Thu', value: 356 },
        { label: 'Fri', value: 298 },
        { label: 'Sat', value: 178 },
        { label: 'Sun', value: 145 },
      ],
    },
    {
      id: '3',
      type: 'pie',
      title: 'Data types distribution',
      data: [
        { label: 'Chromatography', value: 35 },
        { label: 'Mass spec', value: 28 },
        { label: 'Genomics', value: 22 },
        { label: 'Proteomics', value: 15 },
      ],
    },
    {
      id: '4',
      type: 'metric',
      title: 'Key metrics',
      data: [
        { label: 'Total files processed', value: 12847 },
        { label: 'Active pipelines', value: 23 },
        { label: 'Success rate', value: 98 },
        { label: 'Avg processing time (min)', value: 4 },
      ],
    },
    {
      id: '5',
      type: 'bar',
      title: 'Sample counts by experiment',
      data: [
        { label: 'Exp A', value: 156 },
        { label: 'Exp B', value: 203 },
        { label: 'Exp C', value: 178 },
        { label: 'Exp D', value: 245 },
      ],
    },
    {
      id: '6',
      type: 'line',
      title: 'Temperature monitoring',
      data: [
        { label: '0h', value: 22 },
        { label: '4h', value: 24 },
        { label: '8h', value: 26 },
        { label: '12h', value: 25 },
        { label: '16h', value: 23 },
        { label: '20h', value: 22 },
        { label: '24h', value: 21 },
      ],
    },
  ]);

  const renderBarChart = (data: { label: string; value: number }[]) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
      <div className="dashboard-bar-chart">
        {data.map((item, index) => (
          <div key={index} className="dashboard-bar-group">
            <div
              className="dashboard-bar"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: Object.values(chartColors)[index % 5],
              }}
            >
              <span className="dashboard-bar-value">{item.value.toLocaleString()}</span>
            </div>
            <span className="dashboard-bar-label">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderLineChart = (data: { label: string; value: number }[]) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;
    const points = data.map((d, i) => {
      const x = 30 + (i * (240 / (data.length - 1)));
      const y = 120 - ((d.value - minValue) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    const pointsArray = data.map((d, i) => ({
      x: 30 + (i * (240 / (data.length - 1))),
      y: 120 - ((d.value - minValue) / range) * 100,
      value: d.value,
    }));

    return (
      <div className="dashboard-line-chart">
        <svg viewBox="0 0 300 150" className="dashboard-line-svg">
          <polyline
            fill="none"
            stroke={chartColors.primary}
            strokeWidth="2.5"
            points={points}
          />
          {pointsArray.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill={chartColors.primary} />
          ))}
        </svg>
        <div className="dashboard-line-labels">
          {data.map((d, i) => (
            <span key={i}>{d.label}</span>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = (data: { label: string; value: number }[]) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulative = 0;
    const colors = Object.values(chartColors);

    return (
      <div className="dashboard-pie-chart">
        <svg viewBox="0 0 200 200" className="dashboard-pie-svg">
          {data.map((d, i) => {
            const startAngle = (cumulative / total) * 360;
            cumulative += d.value;
            const endAngle = (cumulative / total) * 360;
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            const x1 = 100 + 70 * Math.cos(startRad);
            const y1 = 100 + 70 * Math.sin(startRad);
            const x2 = 100 + 70 * Math.cos(endRad);
            const y2 = 100 + 70 * Math.sin(endRad);
            const pathD = `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`;
            return <path key={i} d={pathD} fill={colors[i % colors.length]} />;
          })}
        </svg>
        <div className="dashboard-pie-legend">
          {data.map((d, i) => (
            <div key={i} className="dashboard-legend-item">
              <span className="dashboard-legend-color" style={{ backgroundColor: colors[i % colors.length] }}></span>
              {d.label} ({Math.round((d.value / total) * 100)}%)
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMetricWidget = (data: { label: string; value: number }[]) => {
    return (
      <div className="dashboard-metrics">
        {data.map((item, index) => (
          <div key={index} className="dashboard-metric-item">
            <div className="dashboard-metric-value">
              {item.label.includes('rate') ? `${item.value}%` : item.value.toLocaleString()}
            </div>
            <div className="dashboard-metric-label">{item.label}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderWidget = (widget: Widget) => {
    return (
      <div key={widget.id} className="dashboard-widget">
        <div className="dashboard-widget-header">
          <h3 className="dashboard-widget-title">{widget.title}</h3>
        </div>
        <div className="dashboard-widget-content">
          {widget.type === 'bar' && renderBarChart(widget.data)}
          {widget.type === 'line' && renderLineChart(widget.data)}
          {widget.type === 'pie' && renderPieChart(widget.data)}
          {widget.type === 'metric' && renderMetricWidget(widget.data)}
        </div>
      </div>
    );
  };

  const handleCreateDashboard = () => {
    if (newDashboardName.trim()) {
      // In a real app, this would create a new dashboard
      setShowNewDashboardModal(false);
      setNewDashboardName('');
    }
  };

  return (
    <div className="dashboards-page">
      <div className="dashboards-header">
        <div className="dashboards-selector">
          <button
            className="dashboard-selector-btn"
            onClick={() => setShowDashboardMenu(!showDashboardMenu)}
          >
            <DashboardIcon />
            <span>{currentDashboard.name}</span>
            <ChevronDownIcon />
          </button>
          {showDashboardMenu && (
            <div className="dashboard-menu">
              {dashboards.map((d) => (
                <button
                  key={d.id}
                  className={`dashboard-menu-item ${d.id === currentDashboard.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentDashboard(d);
                    setShowDashboardMenu(false);
                  }}
                >
                  <span className="dashboard-menu-name">{d.name}</span>
                  <span className="dashboard-menu-date">{d.createdAt}</span>
                </button>
              ))}
              <div className="dashboard-menu-divider" />
              <button
                className="dashboard-menu-item create-new"
                onClick={() => {
                  setShowDashboardMenu(false);
                  setShowNewDashboardModal(true);
                }}
              >
                <PlusIcon />
                <span>Create new dashboard</span>
              </button>
            </div>
          )}
        </div>
        <button className="add-widget-btn" onClick={() => {}}>
          <PlusIcon />
          Add new widgets
        </button>
      </div>

      <div className="dashboards-grid">
        {widgets.map((widget) => renderWidget(widget))}
      </div>

      {showNewDashboardModal && (
        <div className="modal-overlay" onClick={() => setShowNewDashboardModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create new dashboard</h2>
            <input
              type="text"
              className="modal-input"
              placeholder="Dashboard name"
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowNewDashboardModal(false)}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleCreateDashboard}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardsPage;
