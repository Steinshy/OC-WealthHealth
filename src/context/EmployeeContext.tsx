import { createContext, useContext, useReducer } from 'react';
import type { Employee } from '@/types';

type Action = { type: 'ADD_EMPLOYEE'; payload: Employee };

interface EmployeeContextValue {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
}

const EmployeeContext = createContext<EmployeeContextValue | null>(null);

const reducer = (state: Employee[], action: Action): Employee[] => {
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

  const addEmployee = (employee: Employee) => {
    dispatch({ type: 'ADD_EMPLOYEE', payload: employee });
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee }}>
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
