import { ReactNode } from 'react';
import './CustomCard.css';

interface CustomCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function CustomCard({ children, className = '', onClick }: CustomCardProps) {
  return (
    <div
      className={`custom-card ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export default CustomCard;

