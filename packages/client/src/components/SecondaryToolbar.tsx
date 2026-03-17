import { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';
import './SecondaryToolbar.css';

interface SecondaryToolbarProps {
  rightActions?: ReactNode;
}

function SecondaryToolbar({ rightActions }: SecondaryToolbarProps) {
  return (
    <div className="secondary-toolbar">
      <div className="secondary-toolbar-content">
        <div className="secondary-toolbar-left">
          <Breadcrumbs />
        </div>
        {rightActions && (
          <div className="secondary-toolbar-right">
            {rightActions}
          </div>
        )}
      </div>
    </div>
  );
}

export default SecondaryToolbar;

