import { useState } from 'react';
import { useNavigate } from 'react-router';

import type { Employee } from '@/types';
import { getEmployees } from '@/utils/states';
import './styles/List.css';

const ITEMS_PER_PAGE = 10;

export const List = () => {
  const navigate = useNavigate();
  const [employees] = useState<Employee[]>(() => getEmployees());
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEmployees = employees.filter((employee) => Object.values(employee).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())));

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Handle date fields (dateOfBirth, startDate) as dates
    const isDateField = sortConfig.key === 'dateOfBirth' || sortConfig.key === 'startDate';
    if (isDateField) {
      const aDate = new Date(aValue as string).getTime();
      const bDate = new Date(bValue as string).getTime();
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }

    // String comparison for other fields
    if ((aValue as string) < (bValue as string)) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if ((aValue as string) > (bValue as string)) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (key: keyof Employee) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="container">
      <div className="title">
        <h1>HRnet</h1>
      </div>

      <nav>
        <button onClick={() => navigate('/')} className="nav-button">
          Create Employee
        </button>
      </nav>

      <h2>Employees</h2>

      <div className="search-container">
        <input type="text" placeholder="Search employees..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="search-input" />
      </div>

      <div className="table-info">
        <p>
          Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, sortedEmployees.length)} of {sortedEmployees.length} entries
        </p>
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('firstName')} className="sortable">
              First Name {sortConfig.key === 'firstName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('lastName')} className="sortable">
              Last Name {sortConfig.key === 'lastName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('startDate')} className="sortable">
              Start Date {sortConfig.key === 'startDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('department')} className="sortable">
              Department {sortConfig.key === 'department' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('dateOfBirth')} className="sortable">
              Date of Birth {sortConfig.key === 'dateOfBirth' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('street')} className="sortable">
              Street {sortConfig.key === 'street' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('city')} className="sortable">
              City {sortConfig.key === 'city' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('state')} className="sortable">
              State {sortConfig.key === 'state' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('zipCode')} className="sortable">
              Zip Code {sortConfig.key === 'zipCode' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.length > 0 ? (
            paginatedEmployees.map((employee) => (
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

      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="pagination-button">
          Previous
        </button>

        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>

        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="pagination-button">
          Next
        </button>
      </div>
    </div>
  );
};
