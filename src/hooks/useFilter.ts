import { useMemo, useState } from 'react';

export const useFilter = <T extends object>(
  items: T[],
  keys?: readonly (keyof T)[],
  initialTerm = '',
) => {
  const [term, setTerm] = useState(initialTerm);

  const filtered = useMemo(() => {
    const lowerTerm = term.toLowerCase();
    return items.filter((item) => {
      const values = keys ? keys.map((key) => item[key]) : Object.values(item);
      return values.some((value) =>
        String(value).toLowerCase().includes(lowerTerm),
      );
    });
  }, [items, keys, term]);

  return {
    filtered,
    term,
    setTerm,
  };
};
