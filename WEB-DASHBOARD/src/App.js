import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import ControlCenter from './pages/ControlCenter';
import DispatchCenter from './pages/DispatchCenter';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function UnifiedDashboard() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-title">Emergency Dashboard</div>
          <div className="page-subtitle">Real-time overview · ResQRoute Control Platform</div>
        </div>
      </div>

      <div className="alert green">
        ✅ <strong>ResQRoute Dashboard is running successfully!</strong> All systems operational.
      </div>

      <div className="stats-grid">
        <div className="stat-card red">
          <div className="stat-icon">🚨</div>
          <div className="stat-value">7</div>
          <div className="stat-label">Active Emergencies</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">🚑</div>
          <div className="stat-value">12</div>
          <div className="stat-label">Ambulances Ready</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">🚒</div>
          <div className="stat-value">8</div>
          <div className="stat-label">Fire Trucks Ready</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🏥</div>
          <div className="stat-value">6</div>
          <div className="stat-label">Hospitals Online</div>
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { path: '/',         label: 'Dashboard',      icon: '⬡' },
  { path: '/control',  label: 'Control Center', icon: '◎' },
  { path: '/dispatch', label: 'Dispatch',       icon: '⟳' },
  { path: '/admin',    label: 'Admin Panel',    icon: '⚙' },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="app-shell">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
          <div className="sidebar-brand">
            <span className="brand-icon">🚨</span>
            {sidebarOpen && (
              <div className="brand-text">
                <span className="brand-name">ResQRoute</span>
                <span className="brand-sub">Emergency Platform</span>
              </div>
            )}
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="nav-label">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="status-dot online" />
            {sidebarOpen && <span className="status-text">System Online</span>}
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/"         element={<UnifiedDashboard />} />
            <Route path="/control"  element={<ControlCenter />} />
            <Route path="/dispatch" element={<DispatchCenter />} />
            <Route path="/admin"    element={<AdminPanel />} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}