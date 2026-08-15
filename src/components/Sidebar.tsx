import React from 'react';
import { Network, Server, Activity, AlertTriangle, FileText, Settings, User } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate }) => {
  const mainNav = [
    { id: 'network', label: 'Network', icon: Network },
    { id: 'assets', label: 'Assets', icon: Server },
    { id: 'analysis', label: 'Analysis', icon: Activity },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: 4 },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const bottomNav = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="app-logo-container">
          <img src="/logo.jpg" alt="GridSight" className="app-logo-img" />
        </div>
        <div className="app-title-group">
          <h1 className="app-title">GridSight</h1>
          <span className="app-subtitle">Energy Intelligence</span>
        </div>
      </div>

      <div className="sidebar-section">
        <h2 className="section-title">WORKSPACE</h2>
        <nav className="nav-menu">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="nav-icon" size={16} />
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-section">
        <h2 className="section-title">PROJECT</h2>
        <div className="project-selector">
          <span className="project-name">West Meridian Grid</span>
        </div>
      </div>

      <div className="sidebar-spacer" />

      <div className="sidebar-footer">
        <div className="status-indicator">
          <div className="status-dot online"></div>
          <span className="status-text">Online</span>
        </div>
        
        <nav className="nav-menu">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="nav-icon" size={16} />
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
