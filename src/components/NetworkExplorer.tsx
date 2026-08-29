import React, { useRef, useState, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { AssetInspector } from './AssetInspector';
import { ZoomIn, ZoomOut, Compass } from 'lucide-react';
import './NetworkExplorer.css';

export const NetworkExplorer: React.FC = () => {
  const { assets, selectedAssetId, selectAsset } = useAppStore();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.asset-node') || (e.target as HTMLElement).closest('.asset-inspector')) {
      return; // Don't pan if clicking an asset or inspector
    }
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Prevent default scroll behavior
  useEffect(() => {
    const el = wrapperRef.current;
    if (el) {
      const handler = (e: Event) => e.preventDefault();
      el.addEventListener('wheel', handler, { passive: false });
      return () => el.removeEventListener('wheel', handler);
    }
  }, []);

  return (
    <div 
      className="network-explorer" 
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="network-controls">
        <button className="control-btn" onClick={() => setScale(s => Math.min(s + 0.2, 3))}>
          <ZoomIn size={16} />
        </button>
        <button className="control-btn" onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}>
          <ZoomOut size={16} />
        </button>
        <button className="control-btn" onClick={resetView}>
          <Compass size={16} />
        </button>
      </div>

      <div 
        className="network-canvas"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0'
        }}
      >
        {/* Draw connections (simplified lines) */}
        <svg className="network-connections">
          {assets.map(asset => 
            asset.connectedTo?.map(targetId => {
              const target = assets.find(a => a.id === targetId);
              if (!target || !asset.coordinates || !target.coordinates) return null;
              
              // Only draw if both exist
              const isHighlighted = selectedAssetId === asset.id || selectedAssetId === target.id;
              const isDimmed = selectedAssetId && !isHighlighted;

              return (
                <line
                  key={`${asset.id}-${target.id}`}
                  x1={asset.coordinates.x + 80} // Offset for node center
                  y1={asset.coordinates.y + 40}
                  x2={target.coordinates.x + 80}
                  y2={target.coordinates.y + 40}
                  className={`connection-line ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''}`}
                />
              );
            })
          )}
        </svg>

        {/* Draw Assets */}
        {assets.map(asset => {
          if (!asset.coordinates) return null;
          const isSelected = selectedAssetId === asset.id;
          
          // Determine if connected to selected
          let isConnectedToSelected = false;
          if (selectedAssetId && !isSelected) {
            const selectedAsset = assets.find(a => a.id === selectedAssetId);
            if (
              selectedAsset?.connectedTo?.includes(asset.id) || 
              asset.connectedTo?.includes(selectedAssetId)
            ) {
              isConnectedToSelected = true;
            }
          }

          const isDimmed = selectedAssetId && !isSelected && !isConnectedToSelected;

          return (
            <div
              key={asset.id}
              className={`asset-node ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''}`}
              style={{
                left: asset.coordinates.x,
                top: asset.coordinates.y
              }}
              onClick={() => selectAsset(asset.id)}
            >
              <div className={`status-indicator ${asset.operatingStatus.toLowerCase()}`}></div>
              <div className="node-content">
                <div className="node-type">{asset.type}</div>
                <div className="node-name">{asset.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedAssetId && (
        <AssetInspector assetId={selectedAssetId} onClose={() => selectAsset(null)} />
      )}
    </div>
  );
};
