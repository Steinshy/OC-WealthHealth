export interface Employee {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  startDate: string;
  department: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

// An employee as stored in context: the id is assigned on creation
export interface StoredEmployee extends Employee {
  id: string;
}

export interface State {
  name: string;
  abbreviation: string;
}
