// ============================================================
// e-Signature Prototype — SSO Callback Page
// ============================================================
//
// This page is the redirect target for the SSO Identity Provider.
// In production it would parse the authorization code / id_token
// from the URL, exchange it for a session token, then post the
// result back to the opener window. Here we simulate that flow.
// ============================================================

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type CallbackState = 'processing' | 'success' | 'error';

export default function SsoCallbackPage() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<CallbackState>('processing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // In a real integration the IdP redirects here with ?code=... or
    // a hash fragment containing the id_token. We read those params,
    // exchange/validate the token, and post the result to the opener.

    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      // IdP returned an error (e.g. user denied consent)
      const msg = errorDescription || error;
      setErrorMsg(msg);
      setState('error');
      if (window.opener) {
        window.opener.postMessage(
          { type: 'sso-auth-result', ok: false, error: msg },
          window.location.origin,
        );
      }
      return;
    }

    // Simulate token exchange with a short delay
    const timer = setTimeout(() => {
      const token = code || `sso-callback-token-${Date.now()}`;
      setState('success');

      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'sso-auth-result',
            ok: true,
            token,
            method: 'SSO – OIDC',
          },
          window.location.origin,
        );
      }

      // Auto-close after a brief pause
      setTimeout(() => {
        window.close();
      }, 1500);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {state === 'processing' && (
          <>
            <div style={styles.spinner} />
            <h2 style={styles.heading}>Completing sign-in…</h2>
            <p style={styles.sub}>Please wait while we verify your identity.</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div style={styles.checkIcon}>&#10003;</div>
            <h2 style={styles.heading}>Authentication Complete</h2>
            <p style={styles.sub}>You may close this window.</p>
          </>
        )}

        {state === 'error' && (
          <>
            <div style={styles.errorIcon}>&#10007;</div>
            <h2 style={styles.heading}>Authentication Failed</h2>
            <p style={styles.sub}>{errorMsg}</p>
            <button
              style={styles.retryBtn}
              onClick={() => window.close()}
            >
              Close Window
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Inline styles — this page runs in a small popup so we keep it self-contained
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    background: 'white',
    borderRadius: 12,
    padding: '40px 32px',
    width: 380,
    textAlign: 'center' as const,
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
  },
  heading: { margin: '12px 0 4px', fontSize: 20, color: '#1a1a2e' },
  sub: { color: '#666', fontSize: 14, margin: '4px 0 0' },
  spinner: {
    width: 48,
    height: 48,
    margin: '0 auto 16px',
    border: '4px solid #e9ecef',
    borderTopColor: '#1a73e8',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  checkIcon: {
    width: 56, height: 56, margin: '0 auto 8px', background: '#d4edda',
    borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 28, color: '#155724',
  },
  errorIcon: {
    width: 56, height: 56, margin: '0 auto 8px', background: '#f8d7da',
    borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 28, color: '#721c24',
  },
  retryBtn: {
    marginTop: 16, padding: '10px 24px', border: 'none', borderRadius: 6,
    background: '#1a1a2e', color: 'white', fontSize: 14, fontWeight: 600,
    cursor: 'pointer',
  },
};

