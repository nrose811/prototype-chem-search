# SSO Integration for Signature Widget — Implementation Plan

## Overview

Replace the hardcoded password-based authentication in the Signature Widget with a pluggable **AuthProvider** abstraction that supports both the existing password flow and a new SSO re-authentication flow. This enables customers to integrate their own Identity Provider (Okta, Entra ID, Ping, etc.) for 21 CFR Part 11–compliant re-authentication at the moment of signing.

---

## Phase 1: AuthProvider Abstraction

**Goal:** Define the `AuthProvider` interface and refactor `signatureService` to use it.

### Files to create
- `packages/client/src/services/authProvider.ts` — Interface + two implementations

### Interface design

```ts
export interface AuthResult {
  ok: true; token: string; method: string;
} | {
  ok: false; error: string;
}

export interface AuthProvider {
  type: 'password' | 'sso';
  label: string;               // Display name, e.g. "Okta", "Password"
  reauthenticate(userId: string, credential?: string): Promise<AuthResult>;
}
```

### Implementations (both in the same file)

1. **`PasswordAuthProvider`** — Wraps the existing `DEMO_PASSWORD` check. `reauthenticate(userId, password)` validates locally and returns `{ ok: true, token: 'local', method: 'Username + Password' }`.
2. **`MockSsoAuthProvider`** — Simulates an SSO round-trip. `reauthenticate(userId)` opens a popup window (or resolves after a delay with a mock token), returning `{ ok: true, token: 'mock-sso-token', method: 'SSO – Okta (OIDC)' }`. Uses `password123` in the popup for demo purposes.

### Files to modify
- `packages/client/src/services/signatureService.ts` — Accept an `AuthResult` token + method instead of a raw password. The `SignatureRequest` type changes:
  - Remove `password` field
  - Add `authToken: string` and `authMethod: string`
  - `authenticationMethod` on the resulting `SignatureRecord` is set from `authMethod`

---

## Phase 2: SSO Popup Callback Page

**Goal:** Create the small HTML/component that the IdP popup redirects back to.

### Files to create
- `packages/client/src/pages/SsoCallbackPage.tsx` — Minimal page that:
  - Reads the auth code / token from the URL query params
  - Posts it back to the opener window via `window.postMessage()`
  - Shows "Authentication complete — you may close this window"
  - Auto-closes after a short delay

### Files to modify
- `packages/client/src/App.tsx` — Add route `/auth/sso-callback` → `SsoCallbackPage`

---

## Phase 3: AuthProvider Context

**Goal:** Make the active auth provider available app-wide so any `SignatureWidget` instance can use it.

### Files to create
- `packages/client/src/contexts/AuthProviderContext.tsx` — React context that holds the current `AuthProvider` and a setter to switch between providers.

### Default behavior
- Default provider: `PasswordAuthProvider` (preserves current demo behavior)
- Can be switched to `MockSsoAuthProvider` via an IT Admin toggle or a prop

---

## Phase 4: Update SignatureWidget

**Goal:** Make the modal render differently based on the active `AuthProvider.type`.

### Files to modify
- `packages/client/src/components/SignatureWidget.tsx`

### Changes

| Auth mode | What renders instead of the password field |
|-----------|-------------------------------------------|
| `password` | Password `<input>` (current behavior) |
| `sso` | "Authenticate with {provider.label}" button + status indicator |

#### SSO flow in the widget
1. User clicks "Authenticate with Okta" button
2. Widget calls `provider.reauthenticate(userId)` → opens popup
3. Widget shows spinner: "Waiting for authentication…"
4. On success: green checkmark + "Authenticated" badge replaces the button
5. "Apply Signature" button becomes enabled
6. User clicks "Apply Signature" → calls `submitSignature()` with the token

#### State additions
- New `WidgetState` value: `'authenticating'` (between idle and validating)
- New state: `ssoAuthenticated: boolean` — tracks whether SSO re-auth succeeded
- New state: `authToken: string` — stores the token from the provider

### Files to modify (CSS)
- `packages/client/src/components/SignatureWidget.css` — Styles for the SSO button, spinner, and authenticated badge

---

## Phase 5: Update Callers

**Goal:** Ensure all pages that render `SignatureWidget` work with both auth modes.

### Files to modify
- `packages/client/src/pages/CRODataReviewPage.tsx` — No prop changes needed (uses context)
- `packages/client/src/pages/HicQcSummaryPage.tsx` — No prop changes needed (uses context)

### Files to modify (audit trail)
- `packages/client/src/services/auditService.ts` — `authMethod` detail on audit events will now reflect the actual provider used (e.g. `"SSO – Okta (OIDC)"` instead of always `"Username + Password"`)

---

## Phase 6: IT Admin Toggle

**Goal:** Let the IT Admin persona switch between Password and SSO auth modes.

### Files to modify
- `packages/client/src/pages/ITAdminHomePage.tsx` — Add a card/toggle in the admin dashboard:
  - "Authentication Method for E-Signatures"
  - Radio or toggle: `Password` / `SSO (Okta)`
  - Changing it updates the `AuthProviderContext`

---

## Phase 7: Update SignatureRecord & Demo Data

**Goal:** Ensure the `authenticationMethod` field on signed records reflects the actual provider.

### Files to modify
- `packages/client/src/mocks/demoData.ts` — Update `DEFAULT_DEMO_SIGNATURE` in `FileDetailsPage.tsx` to use a dynamic method string
- `packages/client/src/pages/FileDetailsPage.tsx` — The eSignature attributes already display `signature.authenticationMethod`, so no JSX changes needed; just ensure the data flows correctly

---

## File Change Summary

| Action | File |
|--------|------|
| **Create** | `packages/client/src/services/authProvider.ts` |
| **Create** | `packages/client/src/pages/SsoCallbackPage.tsx` |
| **Create** | `packages/client/src/contexts/AuthProviderContext.tsx` |
| Modify | `packages/client/src/services/signatureService.ts` |
| Modify | `packages/client/src/components/SignatureWidget.tsx` |
| Modify | `packages/client/src/components/SignatureWidget.css` |
| Modify | `packages/client/src/pages/CRODataReviewPage.tsx` |
| Modify | `packages/client/src/pages/HicQcSummaryPage.tsx` |
| Modify | `packages/client/src/services/auditService.ts` |
| Modify | `packages/client/src/pages/ITAdminHomePage.tsx` |
| Modify | `packages/client/src/App.tsx` |
| Modify | `packages/client/src/mocks/demoData.ts` |

---

## Demo Flow (after implementation)

1. **Default (Password mode):** Identical to today — user enters `password123` in the modal
2. **SSO mode (toggled by IT Admin):**
   - IT Admin navigates to admin dashboard → switches auth method to "SSO (Okta)"
   - Scientist opens CRO Data Review → clicks "Sign and Approve"
   - Modal shows user identity + "Authenticate with Okta" button
   - Click opens popup → enter `password123` (mock IdP) → popup closes
   - Modal shows green "Authenticated ✓" badge
   - Click "Apply Signature" → signature applied with `authMethod: "SSO – Okta (OIDC)"`
   - Audit trail records the SSO method

