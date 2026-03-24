import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SuccessModal } from '../components/SuccessModal';
import type { Employee } from '../types';
import { states, departments, saveEmployee } from '../utils/states';
import '../styles/form.css';

export const CreateEmployee = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Employee>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    startDate: '',
    department: 'Sales',
    street: '',
    city: '',
    state: 'AL',
    zipCode: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, name, value } = e.target;
    const key = id || name;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmployee(formData);
    setShowModal(true);

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      startDate: '',
      department: 'Sales',
      street: '',
      city: '',
      state: 'AL',
      zipCode: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
      <div className="title">
        <h1>HRnet</h1>
      </div>

      <nav>
        <button onClick={() => navigate('/employees')} className="nav-button">
          View Current Employees
        </button>
      </nav>

      <h2>Create Employee</h2>

      <form onSubmit={handleSubmit} id="create-employee">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <fieldset className="address">
          <legend>Address</legend>

          <div className="form-group">
            <label htmlFor="street">Street</label>
            <input
              type="text"
              id="street"
              value={formData.street}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <select
              id="state"
              value={formData.state}
              onChange={handleInputChange}
              required
            >
              {states.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              required
            />
          </div>
        </fieldset>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            value={formData.department}
            onChange={handleInputChange}
            required
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">
          Save
        </button>
      </form>

      <SuccessModal isOpen={showModal} onClose={handleCloseModal} />
    </div>
  );
};
