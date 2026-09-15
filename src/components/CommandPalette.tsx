import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { Search, Network, Activity, AlertTriangle, Database } from 'lucide-react';
import './CommandPalette.css';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { assets, importDataset, selectAsset } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { id: 'nav-network', icon: Network, label: 'Open Network Explorer', type: 'Navigation', action: () => document.getElementById('nav-network')?.click() },
    { id: 'nav-analysis', icon: Activity, label: 'Open Analysis', type: 'Navigation', action: () => document.getElementById('nav-analysis')?.click() },
    { id: 'nav-alerts', icon: AlertTriangle, label: 'View Active Alerts', type: 'Navigation', action: () => document.getElementById('nav-alerts')?.click() },
    { id: 'import', icon: Database, label: 'Import Dataset', type: 'Action', action: async () => await importDataset() },
  ];

  const assetResults = assets
    .filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.id.toLowerCase().includes(query.toLowerCase()))
    .map(a => ({
      id: `asset-${a.id}`,
      icon: Search,
      label: `Inspect ${a.name} (${a.id})`,
      type: 'Asset',
      action: () => {
        document.getElementById('nav-network')?.click();
        setTimeout(() => selectAsset(a.id), 100);
      }
    }));

  const results = query ? [...actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase())), ...assetResults] : actions;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
        }
        if (e.key === 'Enter' && results[selectedIndex]) {
          e.preventDefault();
          results[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={() => setIsOpen(false)}>
      <div className="command-palette-modal" onClick={e => e.stopPropagation()}>
        <div className="command-input-wrapper">
          <Search size={18} className="command-icon" />
          <input
            ref={inputRef}
            className="command-input"
            placeholder="Search GridSight or type a command..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button className="esc-btn" onClick={() => setIsOpen(false)}>Esc</button>
        </div>
        
        <div className="command-results">
          {results.length === 0 ? (
            <div className="no-results">No results found for "{query}"</div>
          ) : (
            results.map((result, idx) => (
              <div 
                key={result.id}
                className={`command-item ${idx === selectedIndex ? 'selected' : ''}`}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => {
                  result.action();
                  setIsOpen(false);
                }}
              >
                <result.icon size={16} className="item-icon" />
                <span className="item-label">{result.label}</span>
                <span className="item-type">{result.type}</span>
              </div>
            ))
          )}
        </div>

        <div className="command-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to select</span>
        </div>
      </div>
    </div>
  );
};
