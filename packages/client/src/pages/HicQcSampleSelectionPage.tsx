import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Stepper, Step, StepLabel, Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  Checkbox, Paper, Chip,
} from '@mui/material';
import { useHicNavigation } from '../contexts/HicNavigationContext';
import { HIC_SAMPLE_SETS } from '../mocks/demoData';

const STEPS = ['Sample Set Selection', 'QC Details', 'Summary'];

function HicQcSampleSelectionPage() {
  const navigate = useNavigate();
  const { state, actions } = useHicNavigation();
  const [selectedIds, setSelectedIds] = useState<string[]>(state.selectedSampleSetIds);

  const sampleSets = useMemo(() => HIC_SAMPLE_SETS, []);
  const allSelected = selectedIds.length === sampleSets.length && sampleSets.length > 0;

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : sampleSets.map((s) => s.sample_set_id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    actions.setSelectedSampleSetIds(selectedIds);
    actions.markStepComplete('sample-selection');
    actions.setCurrentPage('qc-details');
    navigate('/apps/hic-qc/details');
  };

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>HIC QC Data App</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select sample sets for quality control review
      </Typography>

      <Stepper activeStep={0} alternativeLabel sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {selectedIds.length} of {sampleSets.length} sample sets selected
      </Typography>

      <Paper variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell padding="checkbox">
                <Checkbox checked={allSelected} onChange={toggleAll} inputProps={{ 'aria-label': 'Select all' }} />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sample Set Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>System</TableCell>
              <TableCell sx={{ fontWeight: 600 }}># Samples</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleSets.map((ss) => {
              const checked = selectedIds.includes(ss.sample_set_id);
              return (
                <TableRow
                  key={ss.sample_set_id}
                  hover
                  selected={checked}
                  onClick={() => toggleOne(ss.sample_set_id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={checked}
                      onChange={() => toggleOne(ss.sample_set_id)}
                      onClick={(e) => e.stopPropagation()}
                      inputProps={{ 'aria-label': `Select ${ss.sample_set_name}` }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{ss.sample_set_name}</TableCell>
                  <TableCell>{ss.system_name}</TableCell>
                  <TableCell>
                    <Chip label={ss.samples.length} size="small" variant="outlined" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={() => navigate('/apps')}>Back to Apps</Button>
        <Button variant="contained" disabled={selectedIds.length === 0} onClick={handleContinue}>
          Continue to QC Details
        </Button>
      </Box>
    </Box>
  );
}

export default HicQcSampleSelectionPage;
