import type { GeneratedMolecule } from '../../lib/hitExpansion/generationEngine';
import MoleculeViewer from './MoleculeViewer';
import './CartDrawer.css';

interface Props {
  items: GeneratedMolecule[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

function CartDrawer({ items, isOpen, onClose, onRemove, onClear }: Props) {
  if (!isOpen) return null;

  const exportSmiles = () => {
    const content = items.map((m) => m.smiles).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_molecules.smi';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="he-cart-backdrop" onClick={onClose} />
      <div className="he-cart-drawer">
        <div className="he-cart-header">
          <h3>Cart ({items.length})</h3>
          <button className="he-cart-close" onClick={onClose}>&times;</button>
        </div>

        <div className="he-cart-body">
          {items.length === 0 ? (
            <p className="he-cart-empty">No molecules in cart</p>
          ) : (
            items.map((m) => (
              <div key={m.id} className="he-cart-item">
                <MoleculeViewer smiles={m.smiles} width={56} height={44} />
                <div className="he-cart-item-info">
                  <span className="he-cart-item-id">{m.id}</span>
                  <span className="he-cart-item-meta">
                    Sim: {m.simA.toFixed(2)} | MW: {m.mw.toFixed(0)}
                  </span>
                </div>
                <button
                  className="he-cart-item-remove"
                  onClick={() => onRemove(m.id)}
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>

        <div className="he-cart-footer">
          <button className="he-cart-clear" onClick={onClear} disabled={items.length === 0}>
            Clear All
          </button>
          <button className="he-cart-export" onClick={exportSmiles} disabled={items.length === 0}>
            Export SMILES
          </button>
        </div>
      </div>
    </>
  );
}

export default CartDrawer;
