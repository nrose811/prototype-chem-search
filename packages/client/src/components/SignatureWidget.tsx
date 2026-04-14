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
  AuditContext,
} from '../services/auditService';
import { AuthProvider } from '../services/authProvider';
import { useAuthProvider } from '../contexts/AuthProviderContext';
import './SignatureWidget.css';

type WidgetState = 'idle' | 'authenticating' | 'validating' | 'success' | 'error';

interface SignatureWidgetProps {
  batchId: string;
  datasetVersion: string;
  onSuccess: (signature: SignatureRecord) => void;
  onClose: () => void;
  /** Optional audit context for non-CRO apps (HIC QC, etc.) */
  auditContext?: AuditContext;
  /** Override the context-level auth provider for this widget instance. */
  authProvider?: AuthProvider;
}

export default function SignatureWidget({
  batchId,
  datasetVersion,
  onSuccess,
  onClose,
  auditContext,
  authProvider: authProviderProp,
}: SignatureWidgetProps) {
  const { authProvider: contextProvider } = useAuthProvider();
  const provider = authProviderProp ?? contextProvider;
  const [meaning, setMeaning] = useState<SignatureMeaning>(SIGNATURE_MEANINGS[0]);
  const [password, setPassword] = useState('');
  const [state, setState] = useState<WidgetState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [ssoAuthenticated, setSsoAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [authMethod, setAuthMethod] = useState('');

  const handleSsoAuth = async () => {
    setState('authenticating');
    setErrorMsg('');
    const authResult = await provider.reauthenticate(DEMO_USER.userId);
    if (!authResult.ok) {
      setErrorMsg((authResult as { ok: false; error: string }).error);
      setState('error');
      return;
    }
    setAuthToken(authResult.token);
    setAuthMethod(authResult.method);
    setSsoAuthenticated(true);
    setState('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let token = authToken;
    let method = authMethod;

    if (provider.type === 'password') {
      if (!password.trim()) {
        setErrorMsg('Password is required.');
        setState('error');
        return;
      }
      setState('validating');
      setErrorMsg('');
      const authResult = await provider.reauthenticate(DEMO_USER.userId, password);
      if (!authResult.ok) {
        const failMsg = (authResult as import('../services/authProvider').AuthFailure).error;
        recordSignatureFailed(batchId, datasetVersion, failMsg, auditContext);
        setErrorMsg(failMsg);
        setState('error');
        return;
      }
      token = authResult.token;
      method = authResult.method;
    } else {
      if (!ssoAuthenticated || !token) {
        setErrorMsg('Please authenticate via SSO first.');
        setState('error');
        return;
      }
      setState('validating');
      setErrorMsg('');
    }

    const result: SignatureResult = await submitSignature({
      userId: DEMO_USER.userId,
      authToken: token,
      authMethod: method,
      meaning,
      batchId,
      datasetVersion,
    });

    if (result.ok) {
      recordSignatureApplied(result.signature, auditContext);
      setState('success');
      setTimeout(() => onSuccess(result.signature), 900);
    } else {
      const errorText = (result as { ok: false; error: string }).error;
      recordSignatureFailed(batchId, datasetVersion, errorText, auditContext);
      setErrorMsg(errorText);
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

            {provider.type === 'password' ? (
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
            ) : (
              <div className="sig-field">
                <label>Authentication</label>
                {ssoAuthenticated ? (
                  <div className="sig-sso-authenticated">
                    <span className="sig-sso-check">&#10003;</span>
                    <span>Authenticated via {provider.label}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="sig-sso-btn"
                    onClick={handleSsoAuth}
                    disabled={state === 'authenticating'}
                  >
                    {state === 'authenticating'
                      ? `Waiting for ${provider.label}...`
                      : `Authenticate with ${provider.label}`}
                  </button>
                )}
              </div>
            )}

            {state === 'error' && <div className="sig-error">{errorMsg}</div>}

            <div className="sig-actions">
              <button
                type="button"
                className="sig-cancel"
                onClick={onClose}
                disabled={state === 'validating' || state === 'authenticating'}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="sig-submit"
                disabled={state === 'validating' || state === 'authenticating' || (provider.type === 'sso' && !ssoAuthenticated)}
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

