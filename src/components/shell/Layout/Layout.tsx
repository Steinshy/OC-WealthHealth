import React from 'react';
import { Link, useLocation } from 'react-router';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="appbar">
        <div className="appbar-brand">
          <img
            src={`${import.meta.env.BASE_URL}assets/img/favicon.svg`}
            alt="WealthHealth logo"
            className="appbar-logo"
          />
          <span className="appbar-name">WealthHealth</span>
        </div>
        <nav className="appbar-nav">
          <Link
            to="/"
            className={`appbar-link${location.pathname === '/' ? ' appbar-link--active' : ''}`}
          >
            Create
          </Link>
          <Link
            to="/employees"
            className={`appbar-link${location.pathname === '/employees' ? ' appbar-link--active' : ''}`}
          >
            Employees
          </Link>
        </nav>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  );
};
