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

const COLUMNS: { key: keyof Employee; label: string }[] = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'department', label: 'Department' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'street', label: 'Street' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'zipCode', label: 'Zip Code' },
];

export const EmployeeTable = ({
  employees,
  sortConfig,
  onSort,
}: EmployeeTableProps) => {
  return (
    <div className="employee-table-wrapper">
      <div className="employee-table-scroll">
        <table className="employee-table">
          <thead>
            <tr>
              {COLUMNS.map(({ key, label }) => (
                <SortableTh
                  key={key}
                  onClick={() => onSort(key)}
                  isActive={sortConfig.key === key}
                  direction={sortConfig.direction}
                >
                  {label}
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
      </div>
    </div>
  );
};
