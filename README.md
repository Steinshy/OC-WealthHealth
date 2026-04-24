# WealthHealth Frontend - React Application

A modern React + TypeScript application for the HRnet employee management system.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   └── SuccessModal.tsx # Success notification modal
├── pages/               # Page components
│   ├── CreateEmployee.tsx    # Employee creation form
│   └── EmployeeList.tsx      # Employee list with search/sort
├── styles/              # CSS styling
│   ├── form.css        # Form styling
│   ├── table.css       # Table styling
│   └── modal.css       # Modal styling
├── types/               # TypeScript type definitions
│   └── index.ts        # Employee and State types
├── utils/               # Utility functions
│   └── states.ts       # State data, departments, and helpers
├── App.tsx              # Main app with routing
├── main.tsx             # React entry point
└── App.css              # Global styles
```

## Features

- ✅ Employee creation form with validation
- ✅ Real-time search across employee data
- ✅ Sortable employee table (click column headers)
- ✅ Responsive design for mobile and desktop
- ✅ LocalStorage persistence
- ✅ Success notifications
- ✅ TypeScript for type safety
- ✅ React Router for navigation

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **Vite** - Build tool
- **CSS3** - Styling with responsive design

## Key Components

### CreateEmployee

- Form with all required employee fields
- Date inputs for birth date and start date
- State dropdown with all US states
- Department selection
- Success modal notification on submit

### EmployeeList

- Displays all employees from localStorage
- Real-time search functionality
- Sortable columns (click header to sort)
- Responsive table layout
- Shows entry count

### SuccessModal

- Auto-closing notification
- Feedback for successful operations

## Data Management

Employee data is stored in browser's localStorage under the key `employees`. Each employee object contains:

```typescript
interface Employee {
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
```

## Styling

The application uses a clean, modern design with:

- Consistent color scheme (blues, greens)
- Responsive layout that works on mobile, tablet, and desktop
- Focus states and hover effects for accessibility
- Smooth transitions and animations

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
