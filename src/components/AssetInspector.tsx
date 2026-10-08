import React, { useEffect, useState } from 'react';
import { X, Activity } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { getDatasetRepository } from '../services/repositoryFactory';
import type { Measurement } from '../types';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import './AssetInspector.css';

interface AssetInspectorProps {
  assetId: string;
  onClose: () => void;
}

export const AssetInspector: React.FC<AssetInspectorProps> = ({ assetId, onClose }) => {
  const { assets } = useAppStore();
  const asset = assets.find(a => a.id === assetId);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchMeasurements = async () => {
      setLoading(true);
      const repo = getDatasetRepository();
      const data = await repo.getMeasurements(assetId, '24h');
      if (mounted) {
        setMeasurements(data);
        setLoading(false);
      }
    };
    fetchMeasurements();
    return () => { mounted = false; };
  }, [assetId]);

  if (!asset) return null;

  return (
    <div className="asset-inspector glass-panel">
      <div className="inspector-header">
        <div>
          <div className="inspector-type">{asset.type}</div>
          <div className="inspector-title">
            <h2>{asset.name}</h2>
            <div className={`status-badge ${asset.operatingStatus.toLowerCase()}`}>
              <div className="status-dot"></div>
              {asset.operatingStatus}
            </div>
          </div>
          <div className="inspector-subtitle">
            {asset.manufacturer} • {asset.ratedCapacity}
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="inspector-content">
        
        {/* HEALTH SECTION */}
        <section className="inspector-section">
          <h3 className="section-heading">HEALTH</h3>
          <div className="health-display">
            <div className="health-score">
              {asset.healthScore}
            </div>
            <div className="health-status">
              {asset.healthScore >= 90 ? 'Excellent' : asset.healthScore >= 70 ? 'Good' : 'Needs Attention'}
            </div>
          </div>
        </section>

        {/* LOAD SECTION */}
        <section className="inspector-section">
          <h3 className="section-heading">LOAD PROFILE (24H)</h3>
          
          <div className="chart-container">
            {loading ? (
              <div className="skeleton-pulse" style={{ width: '100%', height: '100%', borderRadius: 8 }}></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={measurements} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-subtle)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="load" 
                    stroke="var(--accent-color)" 
                    fillOpacity={1} 
                    fill="url(#colorLoad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="metrics-row">
            <div className="metric-primary">
              <span className="metric-val">{asset.currentLoad || 0}</span>
              <span className="metric-unit">MVA</span>
            </div>
            <div className="metric-secondary">
              {asset.ratedCapacity ? ((asset.currentLoad || 0) / parseInt(asset.ratedCapacity) * 100).toFixed(1) : 0}% utilization
            </div>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section className="inspector-section">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Temperature</span>
              <span className="detail-value">{asset.temperature || '--'} °C</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Voltage</span>
              <span className="detail-value">{asset.voltage ? (asset.voltage / 1000).toFixed(1) : '--'} kV</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Vibration</span>
              <span className="detail-value">{asset.vibration ? asset.vibration + ' mm/s' : 'Normal'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Oil Level</span>
              <span className="detail-value">{asset.oilLevel || '--'}%</span>
            </div>
          </div>
        </section>

      </div>

      <div className="inspector-footer">
        <button className="btn-secondary">
          <Activity size={14} /> Full Analysis
        </button>
      </div>
    </div>
  );
};
