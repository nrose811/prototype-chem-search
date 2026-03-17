import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import FilterCard, { FilterCardRef } from '../components/FilterCard';
import SearchAssistant from '../components/SearchAssistant';
import { useToolbar } from '../contexts/ToolbarContext';
import './SearchPage.css';

// Icon components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    <path d="M5 3v4"></path>
    <path d="M19 17v4"></path>
    <path d="M3 5h4"></path>
    <path d="M17 19h4"></path>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

interface SearchItem {
  icon: JSX.Element;
  title: string;
  subtitle: string;
}

function SearchPage() {
  const navigate = useNavigate();
  const { setRightActions } = useToolbar();
  const [showFilterView, setShowFilterView] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [lastRemovedFilter, setLastRemovedFilter] = useState<string | null>(null);
  const filterCardRef = useRef<FilterCardRef>(null);

  // Set toolbar actions
  useEffect(() => {
    setRightActions(
      <button
        className="toolbar-upload-btn"
        onClick={() => navigate('/upload')}
      >
        <UploadIcon />
        <span>Upload</span>
      </button>
    );

    return () => setRightActions(null);
  }, [setRightActions, navigate]);

  // Poll for active filters when assistant is open
  useEffect(() => {
    if (!showAssistant) return;

    const interval = setInterval(() => {
      const filters = filterCardRef.current?.getActiveFilters() || [];
      setActiveFilters(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(filters)) {
          return filters;
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showAssistant]);

  const handleAddFilter = (filterName: string) => {
    // Map display names to filter keys
    const filterMap: { [key: string]: string } = {
      'File name': 'fileName',
      'Created date': 'createdBetween',
      'Instrument': 'instrument',
      'Software': 'software',
      'Tags': 'tags',
      'File type': 'type',
    };
    const filterKey = filterMap[filterName] || filterName;
    filterCardRef.current?.addFilter(filterKey);
  };

  const handleSetFilterValue = (filterName: string, value: string) => {
    filterCardRef.current?.setFilterValue(filterName, value);
  };

  const handleFilterRemoved = (filterName: string) => {
    if (showAssistant) {
      setLastRemovedFilter(filterName);
    }
  };

  const savedSearches: SearchItem[] = [
    {
      icon: <FilterIcon />,
      title: 'All data for proteomics study 3',
      subtitle: 'This morning',
    },
    {
      icon: <FilterIcon />,
      title: 'Mass spec data for Sample#897',
      subtitle: 'Yesterday',
    },
    {
      icon: <FilterIcon />,
      title: 'All my data',
      subtitle: 'Last month',
    },
  ];

  const recentSearches: SearchItem[] = [
    {
      icon: <SearchIcon />,
      title: 'Recently loaded data',
      subtitle: 'Today',
    },
    {
      icon: <SearchIcon />,
      title: 'All my data for the last week',
      subtitle: 'Today',
    },
    {
      icon: <SearchIcon />,
      title: 'All my data for the last month',
      subtitle: 'Yesterday',
    },
  ];

  return (
    <div className={`search-page ${showAssistant ? 'assistant-open' : ''}`}>
      <h1 className="search-title">Search</h1>

      <div className="search-bar-container">
        <div className="search-bar">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
          <button
            className={`search-filter-btn ${showFilterView ? 'active' : ''}`}
            onClick={() => setShowFilterView(!showFilterView)}
            aria-label="Filter"
          >
            <FilterIcon />
            <span>Filters</span>
          </button>
          <button
            className={`search-ai-btn ${showAssistant ? 'active' : ''}`}
            onClick={() => setShowAssistant(!showAssistant)}
            aria-label="AI Assistant"
          >
            <SparklesIcon />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      <div className={`search-filter-view ${showFilterView ? 'visible' : ''} ${showAssistant ? 'assistant-open' : ''}`}>
        <FilterCard
          ref={filterCardRef}
          onClose={() => setShowFilterView(false)}
          onSearch={() => {
            setShowFilterView(false);
            navigate('/search-results', { state: { assistantOpen: showAssistant } });
          }}
          onFilterRemoved={handleFilterRemoved}
        />
      </div>

      <div className="search-sections">
        <div className="search-section">
          <h3 className="search-section-title">Saved searches</h3>
          <div className="search-list">
            {savedSearches.map((item, index) => (
              <div
                key={index}
                className="search-list-item"
                onClick={() => navigate('/search-results', { state: { assistantOpen: showAssistant } })}
                style={{ cursor: 'pointer' }}
              >
                <div className="search-item-icon">{item.icon}</div>
                <div className="search-item-text">
                  <div className="search-item-title">{item.title}</div>
                  <div className="search-item-subtitle">{item.subtitle}</div>
                </div>
                <button className="search-item-menu-btn" aria-label="More options">
                  <MoreIcon />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="search-section">
          <h3 className="search-section-title">Recent searches</h3>
          <div className="search-list">
            {recentSearches.map((item, index) => (
              <div
                key={index}
                className="search-list-item"
                onClick={() => navigate('/search-results', { state: { assistantOpen: showAssistant } })}
                style={{ cursor: 'pointer' }}
              >
                <div className="search-item-icon">{item.icon}</div>
                <div className="search-item-text">
                  <div className="search-item-title">{item.title}</div>
                  <div className="search-item-subtitle">{item.subtitle}</div>
                </div>
                <button className="search-item-menu-btn" aria-label="More options">
                  <MoreIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SearchAssistant
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        onBuildFilters={() => {
          setShowFilterView(true);
        }}
        onAddFilter={handleAddFilter}
        onSetFilterValue={handleSetFilterValue}
        activeFilters={activeFilters}
        lastRemovedFilter={lastRemovedFilter}
        onFilterRemovalHandled={() => setLastRemovedFilter(null)}
        onSearch={(searchType) => {
          // Navigate to search results with the detected search type and keep assistant open
          navigate('/search-results', { state: { searchType, assistantOpen: true } });
        }}
        onSaveFilter={() => {
          // TODO: Implement save filter functionality
          console.log('Save filter clicked');
        }}
      />
    </div>
  );
}

export default SearchPage;

