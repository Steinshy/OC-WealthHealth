interface SortIndicatorProps {
  direction: 'asc' | 'desc';
}

export const SortIndicator = ({ direction }: SortIndicatorProps) => {
  return (
    <span className="sort-indicator">{direction === 'asc' ? '↑' : '↓'}</span>
  );
};
