import './TableInfo.css';

interface TableInfoProps {
  startIndex: number;
  endIndex: number;
  totalCount: number;
}

export const TableInfo = ({
  startIndex,
  endIndex,
  totalCount,
}: TableInfoProps) => {
  return (
    <div className="table-info">
      <p>
        Showing {startIndex + 1} to {endIndex} of {totalCount} entries
      </p>
    </div>
  );
};
