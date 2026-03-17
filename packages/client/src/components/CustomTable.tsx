import './CustomTable.css';
import { ReactNode } from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string | ReactNode;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
}

function CustomTable<T extends Record<string, any>>({ data, columns, onRowClick }: TableProps<T>) {
  const getCellContent = (row: T, columnKey: keyof T | string): ReactNode => {
    const value = row[columnKey as keyof T];

    // If the value is already a React element, return it as-is
    if (value && typeof value === 'object' && 'type' in value) {
      return value;
    }

    // Otherwise return the value (string, number, etc.)
    return value;
  };

  return (
    <div className="custom-table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {getCellContent(row, column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomTable;

