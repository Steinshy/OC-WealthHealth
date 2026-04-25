import { useState } from 'react';

export const useFilter = <T extends object>(items: T[], initialTerm = '') => {
  const [term, setTerm] = useState(initialTerm);

  const filtered = items.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(term.toLowerCase()),
    ),
  );

  return {
    filtered,
    term,
    setTerm,
  };
};
