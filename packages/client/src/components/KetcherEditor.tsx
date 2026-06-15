import { useRef, useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import './KetcherEditor.css';

export interface KetcherEditorHandle {
  getSmiles: () => Promise<string>;
  setSmiles: (smiles: string) => Promise<void>;
}

interface Props {
  height?: number;
  onInit?: () => void;
}

let messageId = 0;

const KetcherEditor = forwardRef<KetcherEditorHandle, Props>(
  function KetcherEditor({ height = 400, onInit }, ref) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loadFailed, setLoadFailed] = useState(false);
    const [ready, setReady] = useState(false);
    const pendingRef = useRef<Map<number, (smiles: string) => void>>(new Map());
    // Last SMILES requested via setSmiles — applied (or re-applied) once the
    // iframe is ready, so picking a compound before Ketcher finishes loading
    // still draws the structure.
    const pendingSmilesRef = useRef<string | null>(null);

    const postSetSmiles = useCallback((smiles: string) => {
      iframeRef.current?.contentWindow?.postMessage(
        { source: 'ketcher-parent', type: 'setSmiles', smiles },
        '*',
      );
    }, []);

    const handleMessage = useCallback(
      (e: MessageEvent) => {
        if (!e.data || e.data.source !== 'ketcher-iframe') return;
        const msg = e.data;

        if (msg.type === 'ready') {
          setReady(true);
          onInit?.();
          // Apply any structure requested before Ketcher finished loading.
          if (pendingSmilesRef.current) {
            postSetSmiles(pendingSmilesRef.current);
          }
        }

        if (msg.type === 'smiles' && msg.payload) {
          const resolve = pendingRef.current.get(msg.payload.id);
          if (resolve) {
            pendingRef.current.delete(msg.payload.id);
            resolve(msg.payload.smiles || '');
          }
        }

        if (msg.type === 'error') {
          console.error('[KetcherEditor] iframe error:', msg.payload?.message);
          setLoadFailed(true);
        }
      },
      [onInit, postSetSmiles],
    );

    useEffect(() => {
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }, [handleMessage]);

    // Timeout fallback — if iframe doesn't send 'ready' within 30s, show fallback
    useEffect(() => {
      const timer = setTimeout(() => {
        if (!ready) {
          console.warn('[KetcherEditor] Timed out waiting for Ketcher iframe');
          setLoadFailed(true);
        }
      }, 30000);
      return () => clearTimeout(timer);
    }, [ready]);

    useImperativeHandle(ref, () => ({
      async getSmiles() {
        if (!ready || !iframeRef.current?.contentWindow) return '';
        const id = ++messageId;
        return new Promise<string>((resolve) => {
          pendingRef.current.set(id, resolve);
          iframeRef.current!.contentWindow!.postMessage(
            { source: 'ketcher-parent', type: 'getSmiles', id },
            '*',
          );
          // Timeout for individual request
          setTimeout(() => {
            if (pendingRef.current.has(id)) {
              pendingRef.current.delete(id);
              resolve('');
            }
          }, 5000);
        });
      },
      async setSmiles(smiles: string) {
        // Remember the request so it survives a not-yet-ready editor; applied
        // now if ready, otherwise flushed on the 'ready' message.
        pendingSmilesRef.current = smiles;
        if (ready && iframeRef.current?.contentWindow) {
          postSetSmiles(smiles);
        }
      },
    }));

    if (loadFailed) {
      return (
        <div className="ketcher-fallback">
          <div className="ketcher-fallback-icon">⚗️</div>
          <p>Structure editor unavailable — enter SMILES below.</p>
        </div>
      );
    }

    return (
      <div className="ketcher-container" style={{ height }}>
        {!ready && (
          <div className="ketcher-loading" style={{ height, position: 'absolute', inset: 0, zIndex: 1 }}>
            <div className="ketcher-spinner" />
            <p>Loading structure editor...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="/KetcherDemo/index.html"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Ketcher Molecule Editor"
        />
      </div>
    );
  },
);

export default KetcherEditor;
