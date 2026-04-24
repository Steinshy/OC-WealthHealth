import type { KeyboardEvent } from 'react';
import { SortIndicator } from '@/components/ui/SortIndicator';
import './SortableTh.css';

interface SortableThProps {
  onClick: () => void;
  isActive: boolean;
  direction: 'asc' | 'desc';
  children: React.ReactNode;
}

export const SortableTh = ({
  onClick,
  isActive,
  direction,
  children,
}: SortableThProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTableCellElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <th
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-sort={
        isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'
      }
      className={`sortable${isActive ? ' active' : ''}`}
    >
      {children}
      {isActive && <SortIndicator direction={direction} />}
    </th>
  );
};
