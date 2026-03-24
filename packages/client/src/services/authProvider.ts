// ============================================================
// e-Signature Prototype — Auth Provider Abstraction
// ============================================================
//
// Pluggable authentication for the Signature Widget.
// Customers swap in their own SSO provider (Okta, Entra ID, etc.)
// by implementing the AuthProvider interface.
// ============================================================

import { DEMO_USER, DEMO_PASSWORD } from '../mocks/demoData';

// ----- Types ------------------------------------------------

export type AuthSuccess = { ok: true; token: string; method: string };
export type AuthFailure = { ok: false; error: string };
export type AuthResult = AuthSuccess | AuthFailure;

export interface AuthProvider {
  /** Discriminator so the UI can render the right form controls. */
  type: 'password' | 'sso';
  /** Human-readable label, e.g. "Password", "Okta", "Entra ID". */
  label: string;
  /**
   * Re-authenticate the user at the moment of signing.
   * - Password mode: `credential` is the password string.
   * - SSO mode: `credential` is ignored; the provider opens a
   *   popup / redirect and resolves when the IdP responds.
   */
  reauthenticate(userId: string, credential?: string): Promise<AuthResult>;
}

// ----- Password provider ------------------------------------

export class PasswordAuthProvider implements AuthProvider {
  readonly type = 'password' as const;
  readonly label = 'Password';

  async reauthenticate(userId: string, password?: string): Promise<AuthResult> {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 800));

    if (userId !== DEMO_USER.userId || password !== DEMO_PASSWORD) {
      return {
        ok: false,
        error: 'Authentication failed. Please verify your credentials and try again.',
      };
    }

    return { ok: true, token: 'local-password-token', method: 'Username + Password' };
  }
}

// ----- Mock SSO provider ------------------------------------

export class MockSsoAuthProvider implements AuthProvider {
  readonly type = 'sso' as const;
  readonly label: string;

  constructor(label = 'Okta') {
    this.label = label;
  }

  /**
   * Simulate an SSO re-authentication popup.
   *
   * Opens a small browser popup that prompts for the demo password
   * (standing in for the IdP login page). On success it posts a
   * mock token back via `window.postMessage`.
   */
  async reauthenticate(userId: string): Promise<AuthResult> {
    return new Promise<AuthResult>((resolve) => {
      // Build a simple inline HTML page for the mock IdP popup
      const popupHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Sign in — ${this.label}</title>
          <style>
            body { font-family: system-ui, sans-serif; display: flex; align-items: center;
                   justify-content: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            .card { background: white; border-radius: 12px; padding: 32px; width: 340px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.12); text-align: center; }
            h2 { margin: 0 0 4px; font-size: 20px; }
            .sub { color: #666; font-size: 13px; margin-bottom: 20px; }
            label { display: block; text-align: left; font-size: 13px; font-weight: 600;
                    margin-bottom: 4px; color: #333; }
            input { width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px;
                    font-size: 14px; box-sizing: border-box; margin-bottom: 16px; }
            button { width: 100%; padding: 10px; border: none; border-radius: 6px;
                     background: #1a73e8; color: white; font-size: 14px; font-weight: 600;
                     cursor: pointer; }
            button:hover { background: #1558b0; }
            .error { color: #d32f2f; font-size: 13px; margin-bottom: 12px; display: none; }
            .user-info { font-size: 13px; color: #555; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>${this.label} SSO</h2>
            <p class="sub">Re-authenticate to sign</p>
            <p class="user-info">Signing in as <strong>${userId}</strong></p>
            <label for="pwd">Password</label>
            <input id="pwd" type="password" placeholder="Enter your password" autofocus />
            <div class="error" id="err">Incorrect password. Try again.</div>
            <button id="btn">Sign In</button>
          </div>
          <script>
            const EXPECTED = '${DEMO_PASSWORD}';
            document.getElementById('btn').addEventListener('click', () => {
              const pwd = document.getElementById('pwd').value;
              if (pwd === EXPECTED) {
                window.opener.postMessage({ type: 'sso-auth-result', ok: true, token: 'mock-sso-token-' + Date.now(), method: 'SSO – ${this.label} (OIDC)' }, '*');
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui"><p>Authentication complete. This window will close.</p></div>';
                setTimeout(() => window.close(), 1200);
              } else {
                document.getElementById('err').style.display = 'block';
              }
            });
            document.getElementById('pwd').addEventListener('keydown', (e) => {
              if (e.key === 'Enter') document.getElementById('btn').click();
            });
          </script>
        </body>
        </html>
      `;

      const popup = window.open('', 'sso-auth', 'width=440,height=520,left=200,top=200');
      if (!popup) {
        resolve({ ok: false, error: 'Popup blocked. Please allow popups and try again.' });
        return;
      }
      popup.document.write(popupHtml);
      popup.document.close();

      // Listen for the postMessage from the popup
      const handler = (event: MessageEvent) => {
        if (event.data?.type === 'sso-auth-result') {
          window.removeEventListener('message', handler);
          clearInterval(closedCheck);
          if (event.data.ok) {
            resolve({ ok: true, token: event.data.token, method: event.data.method });
          } else {
            resolve({ ok: false, error: 'SSO authentication failed.' });
          }
        }
      };
      window.addEventListener('message', handler);

      // If the user closes the popup without authenticating
      const closedCheck = setInterval(() => {
        if (popup.closed) {
          clearInterval(closedCheck);
          window.removeEventListener('message', handler);
          resolve({ ok: false, error: 'Authentication cancelled — popup was closed.' });
        }
      }, 500);
    });
  }
}

