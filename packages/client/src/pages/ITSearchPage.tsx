import { useState } from 'react';
import './ITSearchPage.css';

function ITSearchPage() {
  const [showFolders, setShowFolders] = useState(false);

  // Mock file data matching the production UI screenshot
  const files = [
    { name: 'download.jpeg', path: '/', uploadedAt: '2026-02-05 08:38:43 CST', timeAgo: '3 hours ago', category: 'RAW', type: 'image' },
    { name: 'image (4965).png', path: '/', uploadedAt: '2026-02-05 05:03:03 CST', timeAgo: '7 hours ago', category: 'RAW', type: 'image' },
    { name: 'image (4989).png', path: '/sdfjasdfjasdfj', uploadedAt: '2026-02-05 05:02:42 CST', timeAgo: '7 hours ago', category: 'RAW', type: 'image' },
    { name: 'test-measurement-26817.json', path: '/ts-block-6e4c6e0f-e8c2-3e0e-9d65-2aebed', uploadedAt: '2026-02-03 19:09:39 CST', timeAgo: '2 days ago', category: 'RAW', type: 'json' },
    { name: 'test-measurement-26817.json', path: '/ts-block-7a4f032-fe14-45e8-8d67-97e397aa2b49/test', uploadedAt: '2026-02-03 19:09:12 CST', timeAgo: '2 days ago', category: 'RAW', type: 'json' },
    { name: 'test-measurement-26817.json', path: '/ts-block-9c8d-abc3-4f92-ab52-5a44b642e247/test/tss', uploadedAt: '2026-02-03 19:08:41 CST', timeAgo: '2 days ago', category: 'RAW', type: 'json' },
    { name: '20140305500759.json', path: '/WAT19/AgentIntegration01/1966', uploadedAt: '2026-02-03 11:35:22 CST', timeAgo: '2 days ago', category: 'RAW', type: 'json' },
    { name: '20140305500759.json', path: '/WAT19/AgentIntegration01/1284', uploadedAt: '2026-02-03 11:35:22 CST', timeAgo: '2 days ago', category: 'RAW', type: 'json' },
    { name: '20140305500759.json', path: '/WAT19/AgentIntegration01/Methodslog_Inter Precision_Spiker/1973', uploadedAt: '2026-02-03 11:35:22 CST', timeAgo: '2 days ago', category: 'RAW', type: 'json' },
    { name: '20191115211143.json', path: '/WAT19/AgentIntegration01/ETL_01569t_18118/1266', uploadedAt: '2026-02-03 11:34:26 CST', timeAgo: '2 days ago', category: 'RAW', type: 'json' },
  ];

  return (
    <>
      {/* Second Toolbar - Search Title and Upload */}
      <div className="it-page-toolbar">
        <div className="it-toolbar-left">
          <h1 className="it-page-title">Search</h1>
          <button className="it-link-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
            </svg>
          </button>
        </div>
        <button className="it-upload-btn">Upload File</button>
      </div>

      {/* Main Content Area */}
      <div className="it-search-page">
        {/* Left Panel - Filters */}
        <div className="it-search-sidebar">
          <div className="it-saved-searches">
            <label>SAVED SEARCHES</label>
            <select className="it-saved-search-select">
              <option>Choose a saved search</option>
            </select>
          </div>

        <div className="it-filters">
          <button className="it-filter-btn active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <span>9 Filters</span>
          </button>
          <button className="it-filter-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <span>Columns</span>
          </button>
          <label className="it-folder-toggle">
            <input
              type="checkbox"
              checked={showFolders}
              onChange={(e) => setShowFolders(e.target.checked)}
            />
            <span>Show Folders</span>
          </label>
          <button className="it-reset-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Reset Filters
          </button>
        </div>

        <div className="it-search-box">
          <div className="it-collapsible-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
            <label>Search</label>
            <button className="it-help-btn">?</button>
          </div>
          <input
            type="text"
            placeholder="Search Anything (ex. File Name, File Contents, ...)"
            className="it-search-input"
          />
        </div>

        <div className="it-filter-section">
          <div className="it-collapsible-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
            <label>Upload Date</label>
          </div>
          <select className="it-filter-select">
            <option>between</option>
          </select>
          <div className="it-date-inputs">
            <input type="text" className="it-date-input" placeholder="Start date" />
            <input type="text" className="it-date-input" placeholder="End date" />
          </div>
        </div>

        <div className="it-filter-section">
          <div className="it-collapsible-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
            <label>File Category</label>
          </div>
          <select className="it-filter-select">
            <option>is</option>
          </select>
          <div className="it-category-tags">
            <span className="it-category-tag">RAW</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="it-search-results">
        <div className="it-results-table-wrapper">
          <table className="it-results-table">
            <thead>
              <tr>
                <th className="it-checkbox-col">
                  <input type="checkbox" />
                </th>
                <th className="it-name-col">
                  <div className="it-th-content">
                    Name
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="it-sort-icon">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </div>
                </th>
                <th className="it-uploaded-col">
                  <div className="it-th-content">
                    Uploaded At
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="it-sort-icon it-sort-active">
                      <path d="M7 14l5-5 5 5z"/>
                    </svg>
                  </div>
                </th>
                <th className="it-category-col">Category</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td className="it-checkbox-col">
                    <input type="checkbox" />
                  </td>
                  <td className="it-name-col">
                    <div className="it-file-cell">
                      {file.type === 'image' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
                          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af">
                          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                        </svg>
                      )}
                      <div className="it-file-info">
                        <div className="it-file-name">{file.name}</div>
                        <div className="it-file-path">{file.path}</div>
                      </div>
                    </div>
                  </td>
                  <td className="it-uploaded-col">
                    <div className="it-uploaded-info">
                      <div className="it-uploaded-date">{file.uploadedAt}</div>
                      <div className="it-time-ago">{file.timeAgo}</div>
                    </div>
                  </td>
                  <td className="it-category-col">{file.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="it-results-footer">
          <span className="it-footer-info">Showing files 1 - 100 of 1,323,698</span>
          <div className="it-pagination">
            <button className="it-page-btn it-page-active">1</button>
            <button className="it-page-btn">2</button>
            <button className="it-page-btn">3</button>
            <button className="it-page-btn">4</button>
            <button className="it-page-btn">5</button>
            <span className="it-page-ellipsis">...</span>
            <button className="it-page-btn">100</button>
            <button className="it-page-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
          <select className="it-per-page">
            <option>100 / page</option>
            <option>50 / page</option>
            <option>25 / page</option>
          </select>
        </div>
      </div>
    </div>
    </>
  );
}

export default ITSearchPage;

