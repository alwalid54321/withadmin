import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/products', icon: '📦', label: 'Products' },
    { path: '/admin/currencies', icon: '💱', label: 'Currencies' },
    { path: '/admin/users', icon: '👥', label: 'Users' },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <img src="/logo.png" alt="SudaStock" className="admin-logo" />
          <button 
            className="toggle-sidebar" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/admin/profile" className="profile-link">
            <span className="nav-icon">👤</span>
            {isSidebarOpen && <span className="nav-label">Profile</span>}
          </Link>
          <button className="logout-btn">
            <span className="nav-icon">🚪</span>
            {isSidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h1 className="page-title">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="header-right">
            <button className="notifications-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>
            <div className="user-menu">
              <img src="/avatar-placeholder.png" alt="User" className="user-avatar" />
              <span className="user-name">Admin User</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
