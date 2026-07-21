import { SortableTh } from '@/components/patterns';
import type { StoredEmployee } from '@/types';
import { EMPLOYEE_COLUMNS } from './columns';
import './EmployeeTable.css';

interface EmployeeTableProps {
  employees: StoredEmployee[];
  sortConfig: {
    key: keyof StoredEmployee | null;
    direction: 'asc' | 'desc';
  };
  onSort: (key: keyof StoredEmployee) => void;
}

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
              {EMPLOYEE_COLUMNS.map(({ key, label }) => (
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
