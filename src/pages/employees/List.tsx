import {
  useFilter,
  useSortableData,
  usePagination,
  useDocumentTitle,
} from '@/hooks';
import { useEmployees } from '@/context/EmployeeContext';
import { PageTemplate } from '@/components/shell';
import { Pagination } from '@/components/patterns';
import {
  EmployeeListControls,
  EmployeeTable,
  EMPLOYEE_COLUMNS,
} from '@/features/employees';
import type { StoredEmployee } from '@/types';

const ITEMS_PER_PAGE = 10;
// Search only the displayed columns, not internal fields like id
const SEARCH_KEYS = EMPLOYEE_COLUMNS.map((column) => column.key);
const SORT_OPTIONS: { dateKeys: (keyof StoredEmployee)[] } = {
  dateKeys: ['dateOfBirth', 'startDate'],
};

export const List = () => {
  useDocumentTitle('WealthHealth - Employees');
  const { employees } = useEmployees();

  // Compose hooks
  const filter = useFilter(employees, SEARCH_KEYS);
  const sort = useSortableData(filter.filtered, SORT_OPTIONS);
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
