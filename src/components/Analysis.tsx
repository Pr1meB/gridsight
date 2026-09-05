import React, { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line } from 'recharts';
import { Download, SlidersHorizontal, Activity } from 'lucide-react';
import './Analysis.css';

export const Analysis: React.FC = () => {
  const { assets } = useAppStore();
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  // Generate some aggregate fake data for the grid based on timeframe
  const generateTrendData = (tf: string) => {
    const points = tf === '24h' ? 24 : tf === '7d' ? 14 : 30;
    const data = [];
    let baseLoad = 420;
    let baseCapacity = 500;
    
    for (let i = points; i >= 0; i--) {
      baseLoad = Math.max(300, Math.min(480, baseLoad + (Math.random() * 40 - 20)));
      data.push({
        time: `${i}h ago`,
        load: Math.round(baseLoad),
        capacity: baseCapacity,
        utilization: Math.round((baseLoad / baseCapacity) * 100)
      });
    }
    return data;
  };

  const trendData = generateTrendData(timeframe);
  const currentUtil = trendData[trendData.length - 1].utilization;
  const peakLoad = Math.max(...trendData.map(d => d.load));
  const avgLoad = Math.round(trendData.reduce((acc, d) => acc + d.load, 0) / trendData.length);

  return (
    <div className="analysis-workspace">
      <div className="analysis-header">
        <div className="analysis-title-group">
          <h2>Grid Analysis</h2>
          <span className="subtitle">System-wide performance metrics</span>
        </div>
        
        <div className="analysis-actions">
          <div className="timeframe-selector">
            {(['24h', '7d', '30d'] as const).map(tf => (
              <button 
                key={tf}
                className={`tf-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
          <button className="btn-secondary">
            <SlidersHorizontal size={14} /> Filter
          </button>
          <button className="btn-primary">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      <div className="analysis-content">
        <div className="metrics-cards">
          <div className="metric-card">
            <div className="metric-label">System Utilization</div>
            <div className="metric-value">
              {currentUtil}% <span className={`trend ${currentUtil > 85 ? 'warning' : 'good'}`}>
                {currentUtil > 85 ? '↑ High' : '→ Stable'}
              </span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Peak Load</div>
            <div className="metric-value">{peakLoad} <span className="unit">MW</span></div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Average Load</div>
            <div className="metric-value">{avgLoad} <span className="unit">MW</span></div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Active Assets</div>
            <div className="metric-value">{assets.filter(a => a.operatingStatus === 'Online').length} <span className="unit">/ {assets.length}</span></div>
          </div>
        </div>

        <div className="chart-panel glass-panel">
          <div className="panel-header">
            <h3>Load vs Capacity</h3>
            <div className="legend">
              <span className="legend-item"><span className="legend-color load"></span> Load</span>
              <span className="legend-item"><span className="legend-color capacity"></span> Capacity</span>
            </div>
          </div>
          <div className="main-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLoadChart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-panel-elevated)', borderColor: 'var(--border-strong)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="load" stroke="var(--accent-color)" strokeWidth={2} fillOpacity={1} fill="url(#colorLoadChart)" />
                <Line type="stepAfter" dataKey="capacity" stroke="var(--text-secondary)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="secondary-panels">
          <div className="chart-panel glass-panel">
            <div className="panel-header">
              <h3>Asset Health Distribution</h3>
            </div>
            <div className="health-distribution">
              <div className="dist-bar excellent" style={{ width: '65%' }}><span>65% Excellent</span></div>
              <div className="dist-bar good" style={{ width: '25%' }}><span>25% Good</span></div>
              <div className="dist-bar warning" style={{ width: '7%' }}><span>7% Warning</span></div>
              <div className="dist-bar critical" style={{ width: '3%' }}><span>3% Critical</span></div>
            </div>
            <div className="insights-list">
              <div className="insight-item">
                <Activity size={14} className="text-secondary" />
                <span>Overall system health is stable. 3 assets require attention in the next 30 days.</span>
              </div>
            </div>
          </div>

          <div className="chart-panel glass-panel">
            <div className="panel-header">
              <h3>Critical Assets</h3>
            </div>
            <div className="critical-assets-list">
              {assets.filter(a => a.healthScore < 80).slice(0, 3).map(asset => (
                <div key={asset.id} className="critical-asset-row">
                  <div className="ca-info">
                    <span className="ca-name">{asset.name}</span>
                    <span className="ca-type">{asset.type}</span>
                  </div>
                  <div className="ca-score">
                    Health: <span className={asset.healthScore < 60 ? 'text-critical' : 'text-warning'}>{asset.healthScore}</span>
                  </div>
                </div>
              ))}
              {assets.filter(a => a.healthScore < 80).length === 0 && (
                <div className="empty-message">No critical assets found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
