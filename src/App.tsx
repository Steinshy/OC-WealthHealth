import { BrowserRouter, Routes, Route } from 'react-router';

import { Create, List } from '@/pages/employees';
import { Layout } from '@/components/shell';
import { ToastProvider } from '@/components/Toast';

import '@/index.css';

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Create />} />
        <Route path="/employees" element={<List />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
