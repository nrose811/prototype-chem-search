import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Stepper, Step, StepLabel, Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Chip, TextField, Alert, Card, CardContent,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useHicNavigation } from '../contexts/HicNavigationContext';
import { HIC_SAMPLE_SETS, SignatureRecord } from '../mocks/demoData';
import SignatureWidget from '../components/SignatureWidget';
import { createHicQcReport } from '../services/reportService';

const STEPS = ['Sample Set Selection', 'QC Details', 'Summary'];

function HicQcSummaryPage() {
  const navigate = useNavigate();
  const { state, actions } = useHicNavigation();
  const [comments, setComments] = useState('');
  const [signed, setSigned] = useState(false);
  const [showSigModal, setShowSigModal] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);

  const selectedSets = useMemo(
    () => HIC_SAMPLE_SETS.filter((ss) => state.selectedSampleSetIds.includes(ss.sample_set_id)),
    [state.selectedSampleSetIds]
  );

  const totalSamples = useMemo(() => selectedSets.reduce((n, ss) => n + ss.samples.length, 0), [selectedSets]);
  const passCount = useMemo(
    () => selectedSets.flatMap((ss) => ss.samples).filter((s) => s.qc_status === 'Pass').length,
    [selectedSets]
  );
  const failCount = totalSamples - passCount;

  const handleSignSuccess = (signature: SignatureRecord) => {
    const report = createHicQcReport(signature, selectedSets, comments);
    setReportId(report.reportId);
    setSigned(true);
    setShowSigModal(false);
    actions.markStepComplete('summary');
  };

  const summaryCards = [
    { label: 'Sample Sets Reviewed', value: selectedSets.length },
    { label: 'Total Samples', value: totalSamples },
    { label: 'Passed', value: passCount, color: 'success.main' },
    { label: 'Failed / Flagged', value: failCount, color: 'error.main' },
  ];

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>HIC QC Data App</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review summary and sign for approval
      </Typography>

      <Stepper activeStep={2} alternativeLabel sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {signed && (
        <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mb: 3 }}>
          <strong>QC Review Signed</strong> — All selected sample sets have been reviewed and signed off.
        </Alert>
      )}

      {/* Summary cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        {summaryCards.map((c) => (
          <Card key={c.label} variant="outlined">
            <CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {c.label}
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: c.color || 'text.primary' }}>
                {c.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Sample set breakdown */}
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Sample Sets</Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Sample Set</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>System</TableCell>
              <TableCell sx={{ fontWeight: 600 }}># Samples</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Pass</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fail</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedSets.map((ss) => {
              const p = ss.samples.filter((s) => s.qc_status === 'Pass').length;
              const f = ss.samples.length - p;
              return (
                <TableRow key={ss.sample_set_id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{ss.sample_set_name}</TableCell>
                  <TableCell>{ss.system_name}</TableCell>
                  <TableCell>{ss.samples.length}</TableCell>
                  <TableCell><Chip label={p} size="small" color="success" variant="outlined" /></TableCell>
                  <TableCell>
                    {f > 0 ? <Chip label={f} size="small" color="error" variant="outlined" /> : '0'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Comments */}
      <TextField
        label="Comments"
        multiline
        rows={4}
        fullWidth
        placeholder="Add any comments about this QC review..."
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        disabled={signed}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={() => { actions.setCurrentPage('qc-details'); navigate('/apps/hic-qc/details'); }} disabled={signed}>
          Back
        </Button>
        {signed ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {reportId && (
              <Button variant="outlined" onClick={() => navigate(`/apps/hic-qc/report/${reportId}`)}>
                View Signed Report
              </Button>
            )}
            <Button variant="outlined" onClick={() => navigate('/audit-trail')}>
              View Audit Trail
            </Button>
            <Button variant="contained" onClick={() => { actions.resetNavigation(); navigate('/apps'); }}>
              Done — Return to Apps
            </Button>
          </Box>
        ) : (
          <Button variant="contained" onClick={() => setShowSigModal(true)}>
            Sign &amp; Complete
          </Button>
        )}
      </Box>

      {showSigModal && (
        <SignatureWidget
          batchId={`hic-qc-${Date.now()}`}
          datasetVersion="v1.0.0"
          onSuccess={handleSignSuccess}
          onClose={() => setShowSigModal(false)}
          auditContext={{
            origin: 'HIC QC App v1.0.0',
            entityName: `HIC QC Review — ${selectedSets.length} sample set(s)`,
          }}
        />
      )}
    </Box>
  );
}

export default HicQcSummaryPage;
