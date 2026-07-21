import React from 'react';
import { NavLink } from 'react-router';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `appbar-link${isActive ? ' appbar-link--active' : ''}`;

export const Layout = ({ children }: LayoutProps) => {
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
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/create" className={navLinkClass}>
            Create
          </NavLink>
          <NavLink to="/employees" className={navLinkClass}>
            Employees
          </NavLink>
        </nav>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  );
};
