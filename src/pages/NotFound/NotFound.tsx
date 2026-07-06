import { Link } from 'react-router';
import { PageTemplate } from '@/components/shell';
import { useDocumentTitle } from '@/hooks';

export const NotFound = () => {
  useDocumentTitle('WealthHealth - Page Not Found');

  return (
    <PageTemplate pageHeading="Page not found">
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Back to home</Link>
    </PageTemplate>
  );
};
