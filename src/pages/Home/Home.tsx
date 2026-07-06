import { Link } from 'react-router';
import { useDocumentTitle } from '@/hooks';
import './Home.css';

export const Home = () => {
  useDocumentTitle('WealthHealth - Home');

  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">WealthHealth HR</h1>
        <p className="home-subtitle">Manage your workforce from one place.</p>
        <div className="home-actions">
          <Link to="/employees" className="home-btn home-btn--primary">
            View Employees
          </Link>
          <Link to="/create" className="home-btn home-btn--secondary">
            Create Employee
          </Link>
        </div>
      </div>
    </div>
  );
};
