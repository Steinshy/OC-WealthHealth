import { SearchInput, TableInfo } from '@/components/patterns';

interface EmployeeListControlsProps {
  onSearch: (term: string) => void;
  searchTerm: string;
  startIndex: number;
  endIndex: number;
  totalCount: number;
}

export const EmployeeListControls = ({
  onSearch,
  searchTerm,
  startIndex,
  endIndex,
  totalCount,
}: EmployeeListControlsProps) => {
  return (
    <>
      <SearchInput value={searchTerm} onSearchChange={onSearch} />
      <TableInfo
        startIndex={startIndex}
        endIndex={Math.min(endIndex, totalCount)}
        totalCount={totalCount}
      />
    </>
  );
};
