import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

const sourceTypes = [
  { id: 'unknown', name: 'unknown', fileCount: 217 },
  { id: 'beckman-coulter-cell-counter', name: 'beckman-coulter-cell-counter', fileCount: 114 },
  { id: 'advanced-instruments-osmometer', name: 'advanced-instruments-osmometer', fileCount: 0 },
  { id: 'agilent-infinity', name: 'agilent-infinity', fileCount: 0 },
  { id: 'azure-gel-imager', name: 'azure-gel-imager', fileCount: 0 },
  { id: 'biotek-gen5-stream', name: 'biotek-gen5-stream', fileCount: 0 },
  { id: 'bmg-clariostar-plate-reader', name: 'bmg-clariostar-plate-reader', fileCount: 0 },
  { id: 'bmg-fluostar-plate-reader', name: 'bmg-fluostar-plate-reader', fileCount: 0 },
];

const labelNames = [
  'file_type',
  'gen_id',
  'HPLC',
  'processed_by_pipeline',
  'program_name',
  'raw_file_extension',
  'Status',
  'TYPE',
];

interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
}

const folderTree: FolderNode = {
  id: 'root',
  name: '/',
  children: [
    {
      id: 'ec2amaz',
      name: 'EC2AMAZ-K1LVORQ',
      children: [],
    },
    {
      id: 'test_ids',
      name: 'test_ids_files_for_kyle_yamada',
      children: [],
    },
    {
      id: 'flippity',
      name: 'flippity',
      children: [],
    },
    {
      id: 'ts-tesseract',
      name: 'ts-tesseract',
      children: [],
    },
  ],
};

interface Label {
  id: string;
  key: string;
  value: string;
  showDropdown?: boolean;
  searchQuery?: string;
}

function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sourceType, setSourceType] = useState('unknown');
  const [showSourceTypeDropdown, setShowSourceTypeDropdown] = useState(false);
  const [sourceTypeSearch, setSourceTypeSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('/');
  const [showFolderTree, setShowFolderTree] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [labels, setLabels] = useState<Label[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File dropped:', file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const addLabel = () => {
    const newLabel: Label = {
      id: Date.now().toString(),
      key: '',
      value: '',
      showDropdown: false,
      searchQuery: '',
    };
    setLabels([...labels, newLabel]);
  };

  const removeLabel = (id: string) => {
    setLabels(labels.filter(label => label.id !== id));
  };

  const updateLabel = (id: string, field: 'key' | 'value', value: string) => {
    setLabels(labels.map(label =>
      label.id === id ? { ...label, [field]: value } : label
    ));
  };

  const toggleLabelDropdown = (id: string, show: boolean) => {
    setLabels(labels.map(label =>
      label.id === id ? { ...label, showDropdown: show } : label
    ));
  };

  const updateLabelSearch = (id: string, query: string) => {
    setLabels(labels.map(label =>
      label.id === id ? { ...label, searchQuery: query, key: query } : label
    ));
  };

  const selectLabelName = (id: string, name: string) => {
    setLabels(labels.map(label =>
      label.id === id ? { ...label, key: name, showDropdown: false, searchQuery: '' } : label
    ));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredSourceTypes = sourceTypes.filter(st =>
    st.name.toLowerCase().includes(sourceTypeSearch.toLowerCase())
  );

  const selectedSourceType = sourceTypes.find(st => st.id === sourceType);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (node: FolderNode, level: number = 0): JSX.Element => {
    const isExpanded = expandedFolders.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedFolder === node.name;

    return (
      <div key={node.id}>
        <div
          className={`folder-tree-item ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 1.5}rem` }}
          onClick={() => {
            setSelectedFolder(node.name);
            setShowFolderTree(false);
          }}
        >
          {hasChildren && (
            <button
              className="folder-expand-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(node.id);
              }}
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
          {!hasChildren && <span className="folder-spacer" />}
          <svg className="folder-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span className="folder-name">{node.name}</span>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.children!.map(child => renderFolderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="upload-page">
      <button className="upload-back-btn" onClick={() => navigate('/search')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to search
      </button>

      <div className="upload-page-content">
        {/* Source Type and Target Folder Row */}
        <div className="upload-metadata-row">
          {/* Source Type Selector */}
          <div className="source-type-section">
          <label className="source-type-label">SOURCE TYPE</label>
          <div className="source-type-dropdown-container">
            <input
              type="text"
              className="source-type-input"
              value={sourceTypeSearch || selectedSourceType?.name || ''}
              onChange={(e) => {
                setSourceTypeSearch(e.target.value);
                setShowSourceTypeDropdown(true);
              }}
              onFocus={() => setShowSourceTypeDropdown(true)}
              placeholder="Search source type..."
            />
            <span className="source-type-file-count">
              {selectedSourceType?.fileCount || 0} files
            </span>

            {showSourceTypeDropdown && (
              <>
                <div
                  className="source-type-dropdown-overlay"
                  onClick={() => {
                    setShowSourceTypeDropdown(false);
                    setSourceTypeSearch('');
                  }}
                />
                <div className="source-type-dropdown">
                  {filteredSourceTypes.map((st) => (
                    <div
                      key={st.id}
                      className={`source-type-option ${st.id === sourceType ? 'selected' : ''}`}
                      onClick={() => {
                        setSourceType(st.id);
                        setShowSourceTypeDropdown(false);
                        setSourceTypeSearch('');
                      }}
                    >
                      <span className="source-type-option-name">{st.name}</span>
                      <span className="source-type-option-count">{st.fileCount} files</span>
                    </div>
                  ))}
                  <button className="source-type-add-btn">
                    + Add Source Type
                  </button>
                </div>
              </>
            )}
          </div>
          </div>

          {/* Target Folder Selector */}
          <div className="target-folder-section">
          <label className="target-folder-label">SELECTED FOLDER</label>
          <div className="target-folder-input-container">
            <input
              type="text"
              className="target-folder-input"
              value={selectedFolder}
              readOnly
              onClick={() => setShowFolderTree(!showFolderTree)}
            />
          </div>

          {showFolderTree && (
            <>
              <div
                className="folder-tree-overlay"
                onClick={() => setShowFolderTree(false)}
              />
              <div className="folder-tree-container">
                {renderFolderTree(folderTree)}
              </div>
            </>
          )}
          </div>
        </div>

        {/* Labels Section */}
        <div className="labels-section">
          {labels.length === 0 ? (
            <button className="add-label-btn" onClick={addLabel} type="button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="4" x2="8" y2="12" strokeLinecap="round"/>
                <line x1="4" y1="8" x2="12" y2="8" strokeLinecap="round"/>
              </svg>
              Label
            </button>
          ) : (
            <>
              <div className="labels-header">
                <label className="labels-label">LABELS</label>
                <button className="add-label-btn" onClick={addLabel} type="button">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="4" x2="8" y2="12" strokeLinecap="round"/>
                    <line x1="4" y1="8" x2="12" y2="8" strokeLinecap="round"/>
                  </svg>
                  Label
                </button>
              </div>
              <div className="labels-list">
                {labels.map((label) => {
                  const filteredLabelNames = labelNames.filter(name =>
                    name.toLowerCase().includes((label.searchQuery || label.key || '').toLowerCase())
                  );

                  return (
                    <div key={label.id} className="label-row">
                      <div className="label-name-dropdown-container">
                        <input
                          type="text"
                          className="label-key-input"
                          placeholder="Label Name"
                          value={label.searchQuery !== undefined ? label.searchQuery : label.key}
                          onChange={(e) => updateLabelSearch(label.id, e.target.value)}
                          onFocus={() => toggleLabelDropdown(label.id, true)}
                        />
                        <svg className="label-dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="4 6 8 10 12 6" />
                        </svg>

                        {label.showDropdown && (
                          <>
                            <div
                              className="label-dropdown-overlay"
                              onClick={() => toggleLabelDropdown(label.id, false)}
                            />
                            <div className="label-name-dropdown">
                              {filteredLabelNames.map((name) => (
                                <div
                                  key={name}
                                  className={`label-name-option ${label.key === name ? 'selected' : ''}`}
                                  onClick={() => selectLabelName(label.id, name)}
                                >
                                  {name}
                                </div>
                              ))}
                              <button className="label-name-add-btn">
                                + Add Label Name
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      <input
                        type="text"
                        className="label-value-input"
                        placeholder="Value"
                        value={label.value}
                        onChange={(e) => updateLabel(label.id, 'value', e.target.value)}
                      />
                      <button
                        className="remove-label-btn"
                        onClick={() => removeLabel(label.id)}
                        type="button"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="10" x2="15" y2="10" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {!selectedFile && (
          <div
            className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="upload-file-input-hidden"
              onChange={handleFileSelect}
            />
            <svg className="upload-cloud-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9" />
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
            </svg>
            <p className="upload-main-text">Choose a file or drag & drop it here</p>
            <p className="upload-hint-text">Max size: 200MB</p>
            <button
              className="upload-browse-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse File
            </button>
          </div>
        )}

        {selectedFile && (
          <div className="upload-file-preview">
            <div className="upload-file-info">
              <svg className="upload-file-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
              <span className="upload-file-name">{selectedFile.name}</span>
            </div>
            <button
              className="upload-file-remove"
              onClick={handleRemoveFile}
              aria-label="Remove file"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="upload-actions">
          <button
            className="upload-cancel-btn"
            onClick={() => navigate('/search')}
          >
            Cancel
          </button>
          <button
            className="upload-submit-btn"
            disabled={!selectedFile}
            onClick={() => {
              console.log('Upload file:', selectedFile?.name, 'Source type:', sourceType);
              // TODO: Implement file upload
            }}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;

