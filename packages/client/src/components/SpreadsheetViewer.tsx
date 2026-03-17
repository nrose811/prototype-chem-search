import React, { useState } from 'react';
import './SpreadsheetViewer.css';

export interface SpreadsheetCell {
  value: string | number;
  type?: 'text' | 'number' | 'date';
}

export interface SpreadsheetData {
  columns: string[];
  rows: Array<{
    rowNumber: number;
    cells: SpreadsheetCell[];
  }>;
}

interface SpreadsheetViewerProps {
  data: SpreadsheetData;
  fileName: string;
  onCellSelect?: (row: number, col: number, value: string | number) => void;
}

const SpreadsheetViewer: React.FC<SpreadsheetViewerProps> = ({ data, fileName, onCellSelect }) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleCellClick = (rowIndex: number, colIndex: number, value: string | number) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    onCellSelect?.(rowIndex, colIndex, value);
  };

  const getCellClassName = (rowIndex: number, colIndex: number) => {
    const classes = ['spreadsheet-cell'];
    if (selectedCell?.row === rowIndex && selectedCell?.col === colIndex) {
      classes.push('selected');
    }
    if (hoveredRow === rowIndex) {
      classes.push('row-hovered');
    }
    return classes.join(' ');
  };

  return (
    <div className="spreadsheet-viewer">
      <div className="spreadsheet-toolbar">
        <div className="spreadsheet-filename">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>{fileName}</span>
        </div>
        <div className="spreadsheet-info">
          {data.rows.length} rows × {data.columns.length} columns
        </div>
      </div>
      <div className="spreadsheet-container">
        <table className="spreadsheet-table">
          <thead>
            <tr>
              <th className="row-header corner-cell"></th>
              {data.columns.map((col, index) => (
                <th key={index} className="column-header">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr 
                key={row.rowNumber}
                onMouseEnter={() => setHoveredRow(rowIndex)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="row-header">{row.rowNumber}</td>
                {row.cells.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={getCellClassName(rowIndex, colIndex)}
                    onClick={() => handleCellClick(rowIndex, colIndex, cell.value)}
                  >
                    {cell.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpreadsheetViewer;

