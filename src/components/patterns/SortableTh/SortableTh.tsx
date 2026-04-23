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
    <th onClick={onClick} className="sortable">
      {children}
      {isActive && <SortIndicator direction={direction} />}
    </th>
  );
};
