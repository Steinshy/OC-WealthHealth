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
  return (
    <th
      aria-sort={
        isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'
      }
      className={`sortable${isActive ? ' active' : ''}`}
    >
      <button type="button" onClick={onClick}>
        {children}
        {isActive && <SortIndicator direction={direction} />}
      </button>
    </th>
  );
};
