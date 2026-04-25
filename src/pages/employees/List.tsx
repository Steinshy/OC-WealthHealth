import { useFilter, useSortableData, usePagination } from '@/hooks';
import { useEmployees } from '@/context/EmployeeContext';
import { PageTemplate } from '@/components/shell';
import { Pagination } from '@/components/patterns';
import { EmployeeListControls, EmployeeTable } from '@/features/employees';

const ITEMS_PER_PAGE = 10;

export const List = () => {
  const { employees } = useEmployees();

  // Compose hooks
  const filter = useFilter(employees);
  const sort = useSortableData(filter.filtered, {
    dateKeys: ['dateOfBirth', 'startDate'],
  });
  const pagination = usePagination(sort.sortedItems, ITEMS_PER_PAGE);

  const handleSearch = (term: string) => {
    filter.setTerm(term);
    pagination.reset();
  };

  return (
    <PageTemplate pageHeading="Employees">
      <EmployeeListControls
        onSearch={handleSearch}
        searchTerm={filter.term}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalCount={sort.sortedItems.length}
      />
      <EmployeeTable
        employees={pagination.pageItems}
        sortConfig={sort.sortConfig}
        onSort={sort.requestSort}
      />
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onNext={pagination.next}
        onPrev={pagination.prev}
      />
    </PageTemplate>
  );
};
