import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

export type HicPageType = 'sample-selection' | 'qc-details' | 'summary';

interface HicNavigationState {
  currentPage: HicPageType;
  completedSteps: Set<HicPageType>;
  selectedSampleSetIds: string[];
  failedSampleSetIds: string[];
}

interface HicNavigationActions {
  setCurrentPage: (page: HicPageType) => void;
  markStepComplete: (page: HicPageType) => void;
  resetNavigation: () => void;
  setSelectedSampleSetIds: (ids: string[]) => void;
  toggleSampleSetFailed: (sampleSetId: string) => void;
}

interface HicNavigationContextValue {
  state: HicNavigationState;
  actions: HicNavigationActions;
}

const HicNavigationContext = createContext<HicNavigationContextValue | undefined>(undefined);

interface HicNavigationProviderProps {
  children: ReactNode;
}

export function HicNavigationProvider({ children }: HicNavigationProviderProps) {
  const [currentPage, setCurrentPageState] = useState<HicPageType>('sample-selection');
  const [completedSteps, setCompletedSteps] = useState<Set<HicPageType>>(new Set());
  const [selectedSampleSetIds, setSelectedSampleSetIdsState] = useState<string[]>([]);
  const [failedSampleSetIds, setFailedSampleSetIds] = useState<string[]>([]);

  const setCurrentPage = useCallback((page: HicPageType) => {
    setCurrentPageState(page);
  }, []);

  const markStepComplete = useCallback((page: HicPageType) => {
    setCompletedSteps((prev) => new Set(prev).add(page));
  }, []);

  const resetNavigation = useCallback(() => {
    setCurrentPageState('sample-selection');
    setCompletedSteps(new Set());
    setSelectedSampleSetIdsState([]);
    setFailedSampleSetIds([]);
  }, []);

  const toggleSampleSetFailed = useCallback((sampleSetId: string) => {
    setFailedSampleSetIds((prev) =>
      prev.includes(sampleSetId)
        ? prev.filter((id) => id !== sampleSetId)
        : [...prev, sampleSetId]
    );
  }, []);

  const setSelectedSampleSetIds = useCallback((ids: string[]) => {
    setSelectedSampleSetIdsState(ids);
  }, []);

  const state: HicNavigationState = useMemo(
    () => ({
      currentPage,
      completedSteps,
      selectedSampleSetIds,
      failedSampleSetIds,
    }),
    [currentPage, completedSteps, selectedSampleSetIds, failedSampleSetIds]
  );

  const actions: HicNavigationActions = useMemo(
    () => ({
      setCurrentPage,
      markStepComplete,
      resetNavigation,
      setSelectedSampleSetIds,
      toggleSampleSetFailed,
    }),
    [setCurrentPage, markStepComplete, resetNavigation, setSelectedSampleSetIds, toggleSampleSetFailed]
  );

  return (
    <HicNavigationContext.Provider value={{ state, actions }}>
      {children}
    </HicNavigationContext.Provider>
  );
}

export function useHicNavigation() {
  const context = useContext(HicNavigationContext);
  if (!context) {
    throw new Error('useHicNavigation must be used within HicNavigationProvider');
  }
  return context;
}

