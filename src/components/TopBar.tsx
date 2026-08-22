import React, { useState, useEffect } from 'react';
import { Search, Bell, Command, Minus, Square, X, Copy } from 'lucide-react';
import './TopBar.css';

export const TopBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.gridSight && window.gridSight.window) {
      const cleanMax = window.gridSight.window.onMaximized(() => setIsMaximized(true));
      const cleanUnmax = window.gridSight.window.onUnmaximized(() => setIsMaximized(false));
      return () => {
        cleanMax();
        cleanUnmax();
      };
    }
  }, []);

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="search-trigger">
          <Search size={14} className="search-icon" />
          <span className="search-placeholder">Search GridSight...</span>
          <div className="search-shortcut">
            <Command size={12} />
            <span>K</span>
          </div>
        </div>
        
        <div className="system-status">
          <span className="status-dot"></span>
          <span className="status-text">System Live</span>
        </div>
      </div>
      
      <div className="top-bar-right">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={16} />
          <span className="notification-dot"></span>
        </button>
        <div className="user-avatar">
          <span>JD</span>
        </div>
        
        {/* Render window controls only in Electron */}
        {window.gridSight && (
          <div className="window-controls">
            <button className="window-btn minimize" onClick={() => (window as any).gridSight.window.minimize()}>
              <Minus size={14} />
            </button>
            <button className="window-btn maximize" onClick={() => (window as any).gridSight.window.maximize()}>
              {isMaximized ? <Copy size={12} /> : <Square size={12} />}
            </button>
            <button className="window-btn close" onClick={() => (window as any).gridSight.window.close()}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
