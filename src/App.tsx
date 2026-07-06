import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import { Home } from '@/pages/Home';
import { Layout, ErrorBoundary } from '@/components/shell';
import { EmployeeProvider } from '@/context/EmployeeContext';

import '@/index.css';

// Route-level code splitting: only Home ships in the initial bundle
const Create = lazy(() =>
  import('@/pages/employees/Create').then((m) => ({ default: m.Create })),
);
const List = lazy(() =>
  import('@/pages/employees/List').then((m) => ({ default: m.List })),
);
const NotFound = lazy(() =>
  import('@/pages/NotFound/NotFound').then((m) => ({ default: m.NotFound })),
);

const AppRoutes = () => {
  return (
    <Layout>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/employees" element={<List />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <EmployeeProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </EmployeeProvider>
    </BrowserRouter>
  );
};

export default App;
