import { useState } from 'react';

interface SortConfig<T> {
  key: keyof T | null;
  direction: 'asc' | 'desc';
}

interface UseSortableDataOptions<T> {
  dateKeys?: (keyof T)[];
  initial?: { key: keyof T | null; direction: 'asc' | 'desc' };
}

export const useSortableData = <T extends object>(
  items: T[],
  options?: UseSortableDataOptions<T>,
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(
    options?.initial || { key: null, direction: 'asc' },
  );

  const sortedItems = [...items].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    const isDateField = options?.dateKeys?.includes(sortConfig.key);
    if (isDateField) {
      const aDate = new Date(aValue as string).getTime();
      const bDate = new Date(bValue as string).getTime();
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }

    if ((aValue as string) < (bValue as string)) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if ((aValue as string) > (bValue as string)) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return {
    sortedItems,
    sortConfig,
    requestSort,
  };
};
