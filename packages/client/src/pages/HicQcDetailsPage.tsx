import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Stepper, Step, StepLabel, Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Chip,
} from '@mui/material';
import { useHicNavigation } from '../contexts/HicNavigationContext';
import {
  HIC_SAMPLE_SETS, HIC_CHROMATOGRAMS, HIC_STANDARD_CHROMATOGRAM,
  HicSampleRow, ChromatogramSeries,
} from '../mocks/demoData';
import ChromatogramChart from '../components/ChromatogramChart';

const STEPS = ['Sample Set Selection', 'QC Details', 'Summary'];
const PEAK_KEYS = ['peak_1', 'peak_2', 'peak_3', 'peak_4', 'peak_5', 'peak_6'] as const;

function HicQcDetailsPage() {
  const navigate = useNavigate();
  const { state, actions } = useHicNavigation();
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  const selectedSets = useMemo(
    () => HIC_SAMPLE_SETS.filter((ss) => state.selectedSampleSetIds.includes(ss.sample_set_id)),
    [state.selectedSampleSetIds]
  );

  const allSamples: HicSampleRow[] = useMemo(
    () => selectedSets.flatMap((ss) => ss.samples),
    [selectedSets]
  );

  const chartSeries: ChromatogramSeries[] = useMemo(
    () => allSamples.map((s) => HIC_CHROMATOGRAMS[s.sample_id]).filter(Boolean),
    [allSamples]
  );

  const highlightLabel = useMemo(() => {
    if (!activeSampleId) return null;
    const chrom = HIC_CHROMATOGRAMS[activeSampleId];
    return chrom?.label ?? null;
  }, [activeSampleId]);

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>HIC QC Data App</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review QC details and chromatogram data
      </Typography>

      <Stepper activeStep={1} alternativeLabel sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {/* Chromatogram chart */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>HIC Chromatogram Overlay</Typography>
        <ChromatogramChart
          series={chartSeries}
          standard={HIC_STANDARD_CHROMATOGRAM}
          highlightLabel={highlightLabel}
        />
      </Paper>

      {/* Sample data table */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Sample ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sample Set</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>QC Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Injection</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sample Name</TableCell>
              {PEAK_KEYS.map((pk) => (
                <TableCell key={pk} sx={{ fontWeight: 600, textAlign: 'right' }}>
                  {pk.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Area
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allSamples.map((s) => (
              <TableRow
                key={s.sample_id}
                hover
                selected={activeSampleId === s.sample_id}
                onMouseEnter={() => setActiveSampleId(s.sample_id)}
                onMouseLeave={() => setActiveSampleId(null)}
              >
                <TableCell sx={{ fontWeight: 500 }}>{s.sample_id}</TableCell>
                <TableCell>{s.sample_set_name ?? '—'}</TableCell>
                <TableCell>
                  <Chip
                    label={s.qc_status ?? '—'}
                    size="small"
                    color={s.qc_status === 'Pass' ? 'success' : s.qc_status === 'Fail' ? 'error' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{s.injection_time ?? '—'}</TableCell>
                <TableCell>{s.sample_name ?? '—'}</TableCell>
                {PEAK_KEYS.map((pk) => {
                  const peak = s[pk];
                  return (
                    <TableCell key={pk} sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {peak?.area != null ? peak.area.toLocaleString() : '—'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={() => { actions.setCurrentPage('sample-selection'); navigate('/apps/hic-qc'); }}>
          Back
        </Button>
        <Button variant="contained" onClick={() => { actions.markStepComplete('qc-details'); actions.setCurrentPage('summary'); navigate('/apps/hic-qc/summary'); }}>
          Continue to Summary
        </Button>
      </Box>
    </Box>
  );
}

export default HicQcDetailsPage;
