import { SortableTh } from '@/components/patterns';
import type { Employee } from '@/types';
import './EmployeeTable.css';

interface EmployeeTableProps {
  employees: Employee[];
  sortConfig: {
    key: keyof Employee | null;
    direction: 'asc' | 'desc';
  };
  onSort: (key: keyof Employee) => void;
}

const SORT_KEYS: (keyof Employee)[] = [
  'firstName',
  'lastName',
  'startDate',
  'department',
  'dateOfBirth',
  'street',
  'city',
  'state',
  'zipCode',
];

export const EmployeeTable = ({
  employees,
  sortConfig,
  onSort,
}: EmployeeTableProps) => {
  return (
    <table className="employee-table">
      <thead>
        <tr>
          {SORT_KEYS.map((key) => (
            <SortableTh
              key={key}
              onClick={() => onSort(key)}
              isActive={sortConfig.key === key}
              direction={sortConfig.direction}
            >
              {key === 'firstName'
                ? 'First Name'
                : key === 'lastName'
                  ? 'Last Name'
                  : key === 'startDate'
                    ? 'Start Date'
                    : key === 'dateOfBirth'
                      ? 'Date of Birth'
                      : key === 'zipCode'
                        ? 'Zip Code'
                        : key.charAt(0).toUpperCase() + key.slice(1)}
            </SortableTh>
          ))}
        </tr>
      </thead>
      <tbody>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.startDate}</td>
              <td>{employee.department}</td>
              <td>{employee.dateOfBirth}</td>
              <td>{employee.street}</td>
              <td>{employee.city}</td>
              <td>{employee.state}</td>
              <td>{employee.zipCode}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9} className="no-data">
              No employees found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
