import React from 'react';
import { useAppStore } from '../stores/useAppStore';
import { AlertCircle, AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import './Alerts.css';

export const Alerts: React.FC = () => {
  const { alerts, assets } = useAppStore();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL': return <ShieldAlert size={16} className="text-critical" />;
      case 'HIGH LOAD': return <AlertCircle size={16} className="text-critical" />;
      case 'WARNING': return <AlertTriangle size={16} className="text-warning" />;
      case 'MAINTENANCE': return <Info size={16} className="text-info" />;
      case 'ANOMALY': return <AlertTriangle size={16} className="text-warning" />;
      default: return <Info size={16} className="text-secondary" />;
    }
  };

  const getAssetDetails = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    return asset ? `${asset.name} (${asset.type})` : 'Unknown Asset';
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="alerts-workspace">
      <div className="alerts-header">
        <div className="alerts-title-group">
          <h2>Active Alerts</h2>
          <span className="subtitle">{alerts.filter(a => !a.isRead).length} unacknowledged events</span>
        </div>
        <div className="alerts-actions">
          <button className="btn-secondary">
            <CheckCircle2 size={14} /> Acknowledge All
          </button>
        </div>
      </div>

      <div className="alerts-content">
        <div className="alerts-timeline">
          {alerts.length === 0 ? (
            <div className="empty-message">No active alerts. System is nominal.</div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`alert-card glass-panel ${!alert.isRead ? 'unread' : ''}`}>
                <div className="alert-time">
                  <span className="time">{formatTime(alert.timestamp)}</span>
                  <span className="date">{formatDate(alert.timestamp)}</span>
                </div>
                
                <div className="alert-divider">
                  <div className="alert-icon-wrapper">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="alert-line"></div>
                </div>

                <div className="alert-details">
                  <div className="alert-type">{alert.type}</div>
                  <div className="alert-message">{alert.message}</div>
                  
                  <div className="alert-asset-ref">
                    <div className="tree-line"></div>
                    <span className="asset-link">{getAssetDetails(alert.assetId)}</span>
                  </div>
                  
                  <div className="alert-actions">
                    <button className="btn-tertiary">Inspect Asset</button>
                    {!alert.isRead && <button className="btn-tertiary acknowledge">Acknowledge</button>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
