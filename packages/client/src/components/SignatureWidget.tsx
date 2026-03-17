// ============================================================
// e-Signature Prototype — Signature Widget (Modal)
// ============================================================

import { useState } from 'react';
import {
  DEMO_USER,
  SIGNATURE_MEANINGS,
  SignatureMeaning,
  SignatureRecord,
} from '../mocks/demoData';
import {
  submitSignature,
  SignatureResult,
} from '../services/signatureService';
import {
  recordSignatureApplied,
  recordSignatureFailed,
} from '../services/auditService';
import './SignatureWidget.css';

type WidgetState = 'idle' | 'validating' | 'success' | 'error';

interface SignatureWidgetProps {
  batchId: string;
  datasetVersion: string;
  onSuccess: (signature: SignatureRecord) => void;
  onClose: () => void;
}

export default function SignatureWidget({
  batchId,
  datasetVersion,
  onSuccess,
  onClose,
}: SignatureWidgetProps) {
  const [meaning, setMeaning] = useState<SignatureMeaning>(SIGNATURE_MEANINGS[0]);
  const [password, setPassword] = useState('');
  const [state, setState] = useState<WidgetState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Password is required.');
      setState('error');
      return;
    }

    setState('validating');
    setErrorMsg('');

    const result: SignatureResult = await submitSignature({
      userId: DEMO_USER.userId,
      password,
      meaning,
      batchId,
      datasetVersion,
    });

    if (result.ok) {
      recordSignatureApplied(result.signature);
      setState('success');
      // Brief pause so the user sees the success state
      setTimeout(() => onSuccess(result.signature), 900);
    } else {
      recordSignatureFailed(batchId, datasetVersion, result.error);
      setErrorMsg(result.error);
      setState('error');
    }
  };

  return (
    <div className="sig-overlay" onClick={onClose}>
      <div className="sig-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sig-header">
          <h2>Electronic Signature</h2>
          <button className="sig-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        {state === 'success' ? (
          <div className="sig-success">
            <div className="sig-success-icon">&#10003;</div>
            <p>Signature applied successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="sig-disclaimer">
              By signing, you confirm that you have reviewed the data and that this
              electronic signature is the legally binding equivalent of your
              handwritten signature.
            </p>

            <div className="sig-field">
              <label htmlFor="sig-meaning">Meaning of Signature</label>
              <select
                id="sig-meaning"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value as SignatureMeaning)}
                disabled={state === 'validating'}
              >
                {SIGNATURE_MEANINGS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="sig-field">
              <label htmlFor="sig-user">User ID</label>
              <input
                id="sig-user"
                type="text"
                value={`${DEMO_USER.name} (${DEMO_USER.userId})`}
                readOnly
              />
            </div>

            <div className="sig-field">
              <label htmlFor="sig-password">Password</label>
              <input
                id="sig-password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (state === 'error') setState('idle'); }}
                placeholder="Enter your password"
                disabled={state === 'validating'}
                autoFocus
              />
            </div>

            {state === 'error' && <div className="sig-error">{errorMsg}</div>}

            <div className="sig-actions">
              <button
                type="button"
                className="sig-cancel"
                onClick={onClose}
                disabled={state === 'validating'}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="sig-submit"
                disabled={state === 'validating'}
              >
                {state === 'validating' ? 'Verifying...' : 'Apply Signature'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

