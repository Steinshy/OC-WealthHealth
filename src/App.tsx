import { BrowserRouter, Routes, Route } from 'react-router';

import { Create, List } from '@/pages/employees';
import { Home } from '@/pages/Home';
import { Layout } from '@/components/shell';
import { EmployeeProvider } from '@/context/EmployeeContext';

import '@/index.css';

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/employees" element={<List />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <EmployeeProvider>
        <AppRoutes />
      </EmployeeProvider>
    </BrowserRouter>
  );
};

export default App;
