import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomTable, { TableColumn } from '../components/CustomTable';
import './DataTablePage.css';

interface BookmarkedFile {
  id: string;
  name: string;
  sourceLocation: string;
  uploadedAt: string;
  uploadedAtRelative: string;
  fileType: string;
}

// Icon components
const BookmarkIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const LineageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

// Sample bookmarked files data
const bookmarkedFiles: BookmarkedFile[] = [
  {
    id: '1',
    name: 'Proteomics-Study3-Protocol.txt',
    sourceLocation: '/tetrasphere/proteomics/study-3/docs',
    uploadedAt: '01/09/2026 04:30:00 PM EST',
    uploadedAtRelative: 'Yesterday',
    fileType: 'document',
  },
  {
    id: '2',
    name: 'Proteomics-Study3-Sample-A1.raw',
    sourceLocation: '/tetrasphere/proteomics/study-3/samples',
    uploadedAt: '01/10/2026 08:15:33 AM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '5',
    name: 'Proteomics-Study3-QC-Report.pdf',
    sourceLocation: '/tetrasphere/proteomics/study-3/docs',
    uploadedAt: '01/10/2026 02:45:18 PM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
  {
    id: '8',
    name: 'Proteomics-Study3-Results.xlsx',
    sourceLocation: '/tetrasphere/proteomics/study-3/processed',
    uploadedAt: '01/10/2026 05:22:41 PM EST',
    uploadedAtRelative: 'Today',
    fileType: 'document',
  },
];

function DataTablePage() {
  const navigate = useNavigate();
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set(['1', '2', '5', '8']));
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, visible: boolean, fadeOut: boolean}>({message: '', visible: false, fadeOut: false});

  const handleRowClick = (row: typeof dataWithActions[0]) => {
    navigate(`/details/${row.id}`);
  };

  const handleBookmark = (id: string, name: string) => {
    const newBookmarked = new Set(bookmarkedItems);
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id);
      setToast({message: `${name} removed from bookmarks`, visible: true, fadeOut: false});
    } else {
      newBookmarked.add(id);
      setToast({message: `${name} bookmarked`, visible: true, fadeOut: false});
    }
    setBookmarkedItems(newBookmarked);
  };

  const handleDownload = (name: string) => {
    console.log('Download', name);
    // In a real app, this would trigger a file download
  };

  // Map data to include actions
  const dataWithActions = bookmarkedFiles.map(row => ({
    ...row,
    fileName: (
      <div className="file-name-cell">
        <FileIcon />
        <span>{row.name}</span>
      </div>
    ),
    actions: (
      <div className="actions-cell">
        <button
          className="action-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(row.name);
          }}
          aria-label="Download"
          data-tooltip="Download"
        >
          <DownloadIcon />
        </button>
        <button
          className="action-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Show info for', row.name);
          }}
          aria-label="About"
          data-tooltip="About"
        >
          <InfoIcon />
        </button>
        <div className="action-menu-wrapper">
          <button
            className="action-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === row.id ? null : row.id);
            }}
            aria-label="More actions"
            data-tooltip="More actions"
          >
            <MoreIcon />
          </button>
          {openMenuId === row.id && (
            <div className="action-menu">
              <button
                className="action-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Share', row.name);
                  setOpenMenuId(null);
                }}
              >
                <ShareIcon />
                <span>Share</span>
              </button>
              <button
                className="action-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Lineage', row.name);
                  setOpenMenuId(null);
                }}
              >
                <LineageIcon />
                <span>Lineage</span>
              </button>
            </div>
          )}
        </div>
      </div>
    ),
  }));

  // Define table columns
  const columns: TableColumn<typeof dataWithActions[0]>[] = [
    {
      key: 'fileName',
      header: 'File Name',
      width: '35%',
    },
    {
      key: 'sourceLocation',
      header: 'Source Location',
      width: '30%',
    },
    {
      key: 'uploadedAt',
      header: 'Uploaded At',
      width: '20%',
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '15%',
    },
  ];

  return (
    <div className="data-table-page">
      <div className="data-table-content">
        <CustomTable
          data={dataWithActions}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`toast-notification ${toast.fadeOut ? 'fade-out' : ''}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default DataTablePage;

