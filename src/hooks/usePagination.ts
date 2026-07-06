import { useMemo, useState } from 'react';

export const usePagination = <T>(items: T[], pageSize: number) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex],
  );

  const next = () => {
    setPage((p) => Math.min(p + 1, totalPages));
  };

  const prev = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const reset = () => {
    setPage(1);
  };

  const setPageNumber = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  };

  return {
    pageItems,
    page,
    totalPages,
    startIndex,
    endIndex,
    next,
    prev,
    reset,
    setPage: setPageNumber,
  };
};
