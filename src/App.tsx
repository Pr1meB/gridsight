import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { NetworkExplorer } from './components/NetworkExplorer';
import { Analysis } from './components/Analysis';
import { Alerts } from './components/Alerts';
import { CommandPalette } from './components/CommandPalette';
import { useAppStore } from './stores/useAppStore';
import './App.css';

function App() {
  const { initialize, isLoading } = useAppStore();
  const [activeSection, setActiveSection] = useState('network');

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="app-container">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      
      <div className="main-content">
        <TopBar />
        
        <div className="workspace-area">
          {isLoading ? (
            <div className="loading-state">
              <div className="skeleton-pulse"></div>
            </div>
          ) : (
            <>
              {activeSection === 'network' && <NetworkExplorer />}
              {activeSection === 'analysis' && <Analysis />}
              {activeSection === 'alerts' && <Alerts />}
              {!['network', 'analysis', 'alerts'].includes(activeSection) && (
                <div className="empty-state">
                  <div className="empty-icon">◇</div>
                  <h3>Module under construction</h3>
                  <p>Navigate to the Network explorer to interact with GridSight.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <CommandPalette />
    </div>
  );
}

export default App;
