import { Button } from '@/components/ui/Button';
import './Pagination.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}

export const Pagination = ({
  page,
  totalPages,
  onNext,
  onPrev,
}: PaginationProps) => {
  return (
    <div className="pagination">
      <Button onClick={onPrev} disabled={page === 1}>
        Previous
      </Button>

      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>

      <Button
        onClick={onNext}
        disabled={page === totalPages || totalPages === 0}
      >
        Next
      </Button>
    </div>
  );
};
