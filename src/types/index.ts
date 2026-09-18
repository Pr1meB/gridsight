export interface Asset {
  id: string;
  type: 'Power Plant' | 'Substation' | 'Transformer' | 'Transmission Line';
  name: string;
  manufacturer?: string;
  model?: string;
  installationDate?: string;
  ratedCapacity?: string;
  currentLoad?: number; // percentage or absolute
  voltage?: number;
  temperature?: number;
  oilLevel?: number;
  vibration?: number;
  healthScore: number; // 0 - 100
  operatingStatus: 'Online' | 'Offline' | 'Maintenance' | 'Warning' | 'Critical';
  lastMaintenance?: string;
  nextMaintenance?: string;
  coordinates?: { lat: number; lng: number; x: number; y: number };
  connectedTo?: string[];
}

export interface Measurement {
  timestamp: string;
  load: number;
  temperature: number;
  voltage: number;
  vibration: number;
  health: number;
}

export interface Alert {
  id: string;
  assetId: string;
  type: 'HIGH LOAD' | 'WARNING' | 'MAINTENANCE' | 'ANOMALY';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface Dataset {
  name: string;
  assets: Asset[];
  alerts: Alert[];
}

export interface AnalysisResult {
  averageLoad: number;
  peakLoad: number;
  capacityUtilization: number;
  overloadPeriods: number;
  temperatureTrend: string;
  thresholdViolations: number;
  thermalStressIndicator: number;
}

declare global {
  interface Window {
    gridSight?: any;
  }
}
