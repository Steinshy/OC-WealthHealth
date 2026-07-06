import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import type { Employee, StoredEmployee } from '@/types';

type Action = { type: 'ADD_EMPLOYEE'; payload: Employee };

interface EmployeeContextValue {
  employees: StoredEmployee[];
  addEmployee: (employee: Employee) => void;
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null);

const reducer = (state: StoredEmployee[], action: Action): StoredEmployee[] => {
  switch (action.type) {
    case 'ADD_EMPLOYEE':
      return [...state, { ...action.payload, id: crypto.randomUUID() }];
    default:
      return state;
  }
};

export const EmployeeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [employees, dispatch] = useReducer(reducer, []);

  const addEmployee = useCallback((employee: Employee) => {
    dispatch({ type: 'ADD_EMPLOYEE', payload: employee });
  }, []);

  const value = useMemo(
    () => ({ employees, addEmployee }),
    [employees, addEmployee],
  );

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = (): EmployeeContextValue => {
  const ctx = useContext(EmployeeContext);
  if (!ctx)
    throw new Error('useEmployees must be used within EmployeeProvider');
  return ctx;
};
