import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, FileText, Search, Mail, Bot, User, LogOut, Menu, X, Zap, Sun, Moon } from 'lucide-react';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/cv',           icon: FileText,         label: 'Mon CV' },
  { to: '/job-analyzer', icon: Search,           label: 'Analyser une offre' },
  { to: '/cover-letter', icon: Mail,             label: 'Lettre de motivation' },
  { to: '/assistant',    icon: Bot,              label: 'Assistant IA' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-container">
      <button className="sidebar-toggle btn btn-secondary btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo + toggle */}
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="logo-text">
              <div style={{ width: 32, height: 32, background: 'var(--gradient-blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={18} color={isDark ? '#0d0d1a' : '#fff'} />
              </div>
              CVBoost AI
            </div>
            <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Mode clair' : 'Mode sombre'}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Menu</div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <Icon className="nav-icon" />
              {label}
            </NavLink>
          ))}
          <div className="nav-section-title" style={{ marginTop: '0.75rem' }}>Compte</div>
          <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <User className="nav-icon" />
            Mon profil
          </NavLink>
        </nav>

        {/* User bottom */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 34, height: 34, background: 'var(--gradient-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: isDark ? '#0d0d1a' : '#fff', fontSize: '0.9rem', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="nav-item" style={{ borderRadius: 8, color: '#dc2626', fontSize: '0.82rem' }}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="moroccan-accent"></div>
        <div className="page-enter"><Outlet /></div>
      </main>
    </div>
  );
}
