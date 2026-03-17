import React, { useState, useRef, useEffect } from 'react';
import { SpreadsheetData } from './SpreadsheetViewer';
import './FileAssistant.css';

// Icons
const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z" />
    <path d="M5 3L5.5 5L7 5.5L5.5 6L5 8L4.5 6L3 5.5L4.5 5L5 3Z" />
    <path d="M19 17L19.5 19L21 19.5L19.5 20L19 22L18.5 20L17 19.5L18.5 19L19 17Z" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  chartType?: 'bar' | 'line' | 'pie';
}

interface ChartDataPoint {
  label: string;
  value: number;
}

interface FileAssistantProps {
  spreadsheetData?: SpreadsheetData;
  fileName: string;
  onGenerateChart?: (chartType: string, data: any) => void;
  onClose?: () => void;
}

const FileAssistant: React.FC<FileAssistantProps> = ({ spreadsheetData, fileName, onGenerateChart, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<ChartDataPoint | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chartColors = {
    primary: '#1976D2',
    secondary: '#42A5F5',
    tertiary: '#64B5F6',
    quaternary: '#90CAF9',
  };
  const colorArray = [chartColors.primary, chartColors.secondary, chartColors.tertiary, chartColors.quaternary];

  const suggestionPills = [
    'Analyze this data',
    'Create a chart',
    'Find patterns',
    'Calculate statistics',
    'Summarize the data',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract chart data from spreadsheet (Organization and Total Pipeline Executions)
  const getChartData = (): ChartDataPoint[] => {
    if (!spreadsheetData || spreadsheetData.rows.length < 2) return [];
    return spreadsheetData.rows.slice(1).map(row => ({
      label: String(row.cells[0]?.value || ''),
      value: Number(row.cells[1]?.value || 0),
    })).filter(item => item.label && item.value > 0);
  };

  const generateResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let chartType: 'bar' | 'line' | 'pie' | undefined;

    // Handle specific chart type requests
    if (lowerQuery.includes('bar chart') || lowerQuery.includes('bar graph')) {
      const chartData = getChartData();
      response = `I've created a bar chart showing Total Pipeline Executions by Organization. ${chartData.length > 0 ? `The data shows ${chartData.length} organizations.` : ''}`;
      suggestions = ['Line chart', 'Pie chart', 'Analyze trends'];
      chartType = 'bar';
    } else if (lowerQuery.includes('line chart') || lowerQuery.includes('line graph')) {
      const chartData = getChartData();
      response = `Here's a line chart showing the pipeline executions trend. ${chartData.length > 0 ? `Displaying ${Math.min(chartData.length, 7)} data points.` : ''}`;
      suggestions = ['Bar chart', 'Pie chart', 'Find patterns'];
      chartType = 'line';
    } else if (lowerQuery.includes('pie chart') || lowerQuery.includes('pie graph')) {
      const chartData = getChartData();
      response = `Here's a pie chart showing the distribution. ${chartData.length > 0 ? `Showing top ${Math.min(chartData.length, 4)} organizations.` : ''}`;
      suggestions = ['Bar chart', 'Line chart', 'Show percentages'];
      chartType = 'pie';
    } else if (lowerQuery.includes('analyze') || lowerQuery.includes('analysis')) {
      response = `I've analyzed the data in "${fileName}". The spreadsheet contains ${spreadsheetData?.rows.length || 0} rows and ${spreadsheetData?.columns.length || 0} columns. Key observations:\n\n• The data appears to be well-structured\n• There are numeric values that could be aggregated\n• Consider creating visualizations to identify trends`;
      suggestions = ['Show top values', 'Create bar chart', 'Find outliers'];
    } else if (lowerQuery.includes('chart') || lowerQuery.includes('graph') || lowerQuery.includes('visuali')) {
      response = `I can create several chart types for this data:\n\n• Bar chart - great for comparing categories\n• Line chart - shows trends over time\n• Pie chart - displays proportions\n\nWhich type would you like?`;
      suggestions = ['Bar chart', 'Line chart', 'Pie chart'];
    } else if (lowerQuery.includes('pattern') || lowerQuery.includes('trend')) {
      response = `Looking for patterns in the data...\n\nI found some interesting trends:\n• Values tend to increase in the later rows\n• There's a correlation between columns A and C\n• Some values appear multiple times`;
      suggestions = ['Bar chart', 'Line chart', 'Pie chart'];
    } else if (lowerQuery.includes('statistic') || lowerQuery.includes('average') || lowerQuery.includes('sum') || lowerQuery.includes('count')) {
      const rowCount = spreadsheetData?.rows.length || 0;
      response = `Here are the statistics for the data:\n\n• Total rows: ${rowCount}\n• Total columns: ${spreadsheetData?.columns.length || 0}\n• Data points: ${rowCount * (spreadsheetData?.columns.length || 0)}`;
      suggestions = ['Bar chart', 'Pie chart', 'Find min/max'];
    } else if (lowerQuery.includes('summarize') || lowerQuery.includes('summary')) {
      response = `**Summary of ${fileName}**\n\nThis spreadsheet contains organizational data with ${spreadsheetData?.rows.length || 0} records. The data is structured with columns for different metrics and can be used for analysis and visualization.`;
      suggestions = ['Bar chart', 'Line chart', 'Pie chart'];
    } else if (lowerQuery.includes('top') || lowerQuery.includes('highest') || lowerQuery.includes('best')) {
      response = `Here are the top entries based on the data:\n\n1. Row with highest values\n2. Most frequent categories\n3. Key performers\n\nWould you like to filter or sort by a specific column?`;
      suggestions = ['Bar chart', 'Pie chart', 'Filter data'];
    } else {
      response = `I can help you analyze "${fileName}". Try asking me to:\n\n• Analyze the data\n• Create a chart\n• Find patterns\n• Calculate statistics`;
      suggestions = ['Bar chart', 'Line chart', 'Pie chart'];
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      suggestions,
      chartType,
    };
  };

  const renderChart = (type: 'bar' | 'line' | 'pie') => {
    const chartData = getChartData();
    if (chartData.length === 0) return null;
    const maxValue = Math.max(...chartData.map(d => d.value));

    if (type === 'bar') {
      return (
        <div className="fa-chart-container">
          <div className="fa-chart-title">Total Pipeline Executions by Organization</div>
          <div className="fa-bar-chart">
            {chartData.slice(0, 6).map((item, idx) => (
              <div key={idx} className={`fa-bar-group ${hoveredDataPoint?.label === item.label ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredDataPoint(item)} onMouseLeave={() => setHoveredDataPoint(null)}>
                <div className="fa-bar" style={{ height: `${(item.value / maxValue) * 100}%`, backgroundColor: chartColors.primary }}>
                  <span className="fa-bar-value">{item.value}</span>
                </div>
                <div className="fa-bar-label">{item.label.length > 8 ? item.label.substring(0, 8) + '..' : item.label}</div>
              </div>
            ))}
          </div>
          {hoveredDataPoint && <div className="fa-chart-tooltip"><strong>{hoveredDataPoint.label}</strong>: {hoveredDataPoint.value}</div>}
        </div>
      );
    }

    if (type === 'line') {
      const linePoints = chartData.slice(0, 7).map((item, idx) => ({
        x: 25 + idx * 38, y: 115 - (item.value / maxValue) * 100, label: item.label, value: item.value,
      }));
      return (
        <div className="fa-chart-container">
          <div className="fa-chart-title">Pipeline Executions Trend</div>
          <div className="fa-line-chart">
            <svg viewBox="0 0 290 140" className="fa-line-svg">
              <polyline fill="none" stroke={chartColors.primary} strokeWidth="3" points={linePoints.map(p => `${p.x},${p.y}`).join(' ')} />
              {linePoints.map((point, i) => (
                <circle key={i} cx={point.x} cy={point.y} r={hoveredDataPoint?.label === point.label ? 8 : 5}
                  fill={chartColors.primary} onMouseEnter={() => setHoveredDataPoint({ label: point.label, value: point.value })}
                  onMouseLeave={() => setHoveredDataPoint(null)} style={{ cursor: 'pointer' }} />
              ))}
            </svg>
            <div className="fa-line-labels">{chartData.slice(0, 7).map((item, idx) => <span key={idx}>{item.label.substring(0, 5)}</span>)}</div>
          </div>
          {hoveredDataPoint && <div className="fa-chart-tooltip"><strong>{hoveredDataPoint.label}</strong>: {hoveredDataPoint.value}</div>}
        </div>
      );
    }

    if (type === 'pie') {
      const pieData = chartData.slice(0, 4);
      const total = pieData.reduce((sum, item) => sum + item.value, 0);
      const circumference = 2 * Math.PI * 50;
      let offset = 0;
      const pieSlices = pieData.map((item, idx) => {
        const dashLength = (item.value / total) * circumference;
        const slice = { dashLength, offset, color: colorArray[idx % 4], label: item.label, value: item.value };
        offset -= dashLength;
        return slice;
      });
      return (
        <div className="fa-chart-container">
          <div className="fa-chart-title">Pipeline Executions Distribution</div>
          <div className="fa-pie-chart">
            <svg viewBox="0 0 140 140" className="fa-pie-svg">
              {pieSlices.map((slice, idx) => (
                <circle key={idx} cx="70" cy="70" r="50" fill="transparent" stroke={slice.color}
                  strokeWidth={hoveredDataPoint?.label === slice.label ? 28 : 24}
                  strokeDasharray={`${slice.dashLength} ${circumference}`} strokeDashoffset={slice.offset}
                  onMouseEnter={() => setHoveredDataPoint({ label: slice.label, value: slice.value })}
                  onMouseLeave={() => setHoveredDataPoint(null)} style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }} />
              ))}
            </svg>
            <div className="fa-pie-legend">
              {pieData.map((item, idx) => (
                <div key={idx} className={`fa-legend-item ${hoveredDataPoint?.label === item.label ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredDataPoint(item)} onMouseLeave={() => setHoveredDataPoint(null)}>
                  <span className="fa-legend-color" style={{ backgroundColor: colorArray[idx % 4] }}></span>
                  {item.label.length > 10 ? item.label.substring(0, 10) + '..' : item.label} ({Math.round((item.value / total) * 100)}%)
                </div>
              ))}
            </div>
          </div>
          {hoveredDataPoint && <div className="fa-chart-tooltip"><strong>{hoveredDataPoint.label}</strong>: {hoveredDataPoint.value}</div>}
        </div>
      );
    }
    return null;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const response = generateResponse(inputValue);
      setMessages(prev => [...prev, response]);
    }, 500);
  };

  const handlePillClick = (pill: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: pill,
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const response = generateResponse(pill);
      setMessages(prev => [...prev, response]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="file-assistant">
      <div className="file-assistant-header">
        <div className="file-assistant-title">
          <SparklesIcon />
          <h2>AI Assistant</h2>
        </div>
        {onClose && (
          <button className="file-assistant-close-btn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        )}
      </div>

      <div className="file-assistant-content">
        {messages.length === 0 && (
          <>
            <div className="file-assistant-welcome">
              <div className="file-assistant-welcome-icon">
                <SparklesIcon />
              </div>
              <h3>How can I help?</h3>
              <p>Ask me anything about your spreadsheet data</p>
            </div>

            <div className="file-assistant-pills">
              {suggestionPills.map((pill, index) => (
                <button
                  key={index}
                  className="file-assistant-pill"
                  onClick={() => handlePillClick(pill)}
                >
                  {pill}
                </button>
              ))}
            </div>
          </>
        )}

        {messages.length > 0 && (
          <div className="file-assistant-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message message-${message.type}`}>
                <div className="message-icon">
                  {message.type === 'user' ? <UserIcon /> : <SparklesIcon />}
                </div>
                <div className="message-content">
                  <p>{message.content}</p>
                  {message.chartType && renderChart(message.chartType)}
                  {message.suggestions && (
                    <div className="message-suggestions">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="message-suggestion-pill"
                          onClick={() => handlePillClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="file-assistant-footer">
        <div className="file-assistant-input-container">
          <input
            type="text"
            className="file-assistant-input"
            placeholder="Ask about your data..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="file-assistant-send"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileAssistant;
