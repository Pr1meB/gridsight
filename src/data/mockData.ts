import type { Asset, Alert, Dataset, Measurement } from '../types';

export const mockAssets: Asset[] = [
  {
    id: 'PP-100',
    type: 'Power Plant',
    name: 'Northwind Solar Farm',
    manufacturer: 'SolarTech',
    installationDate: '2019-04-12',
    ratedCapacity: '150 MW',
    currentLoad: 85,
    healthScore: 92,
    operatingStatus: 'Online',
    coordinates: { lat: 45.1, lng: -120.2, x: 100, y: 100 },
    connectedTo: ['ST-101'],
  },
  {
    id: 'ST-101',
    type: 'Substation',
    name: 'Valley Hub Substation',
    installationDate: '2015-08-22',
    ratedCapacity: '200 MVA',
    currentLoad: 78,
    healthScore: 88,
    operatingStatus: 'Online',
    coordinates: { lat: 45.2, lng: -120.1, x: 300, y: 200 },
    connectedTo: ['PP-100', 'TX-2048', 'TX-2049'],
  },
  {
    id: 'TX-2048',
    type: 'Transformer',
    name: 'Transformer TX-2048',
    manufacturer: 'ABB',
    model: 'MegaTrans 5000',
    installationDate: '2018-11-05',
    ratedCapacity: '50 MVA',
    currentLoad: 92,
    voltage: 115000,
    temperature: 82,
    oilLevel: 75,
    vibration: 2.1,
    healthScore: 65,
    operatingStatus: 'Warning',
    lastMaintenance: '2023-01-15',
    nextMaintenance: '2024-01-15',
    coordinates: { lat: 45.3, lng: -120.0, x: 500, y: 150 },
    connectedTo: ['ST-101', 'TL-500'],
  },
  {
    id: 'TX-2049',
    type: 'Transformer',
    name: 'Transformer TX-2049',
    manufacturer: 'Siemens',
    model: 'VoltMaster 300',
    installationDate: '2020-02-18',
    ratedCapacity: '50 MVA',
    currentLoad: 45,
    voltage: 115000,
    temperature: 45,
    oilLevel: 90,
    vibration: 0.5,
    healthScore: 98,
    operatingStatus: 'Online',
    lastMaintenance: '2023-06-20',
    nextMaintenance: '2024-06-20',
    coordinates: { lat: 45.15, lng: -119.8, x: 500, y: 350 },
    connectedTo: ['ST-101'],
  },
  {
    id: 'TL-500',
    type: 'Transmission Line',
    name: 'High Voltage Line A',
    installationDate: '2010-05-10',
    ratedCapacity: '500 kV',
    currentLoad: 88,
    healthScore: 78,
    operatingStatus: 'Online',
    coordinates: { lat: 45.4, lng: -119.5, x: 700, y: 150 },
    connectedTo: ['TX-2048'],
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    assetId: 'TX-2048',
    type: 'HIGH LOAD',
    message: 'Transformer TX-2048 exceeded 90% capacity.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
  },
  {
    id: 'ALT-002',
    assetId: 'ST-101',
    type: 'WARNING',
    message: 'Substation ST-101 has abnormal voltage variation.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: false,
  },
];

export const mockDataset: Dataset = {
  name: 'Default Simulation Data',
  assets: mockAssets,
  alerts: mockAlerts,
};

// Generate realistic looking mock measurements
export function generateMockMeasurements(assetId: string, timeframe: string): Measurement[] {
  const points = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 * 4 : 30;
  const now = Date.now();
  const step = timeframe === '24h' ? 3600000 : timeframe === '7d' ? 3600000 * 6 : 86400000;
  
  const measurements: Measurement[] = [];
  
  // Base values
  let load = 60;
  let temp = 50;
  
  if (assetId === 'TX-2048') {
    load = 85;
    temp = 75;
  }
  
  for (let i = points; i >= 0; i--) {
    // Add some random walk
    load = Math.max(10, Math.min(100, load + (Math.random() * 10 - 5)));
    temp = Math.max(30, Math.min(100, temp + (Math.random() * 8 - 4)));
    
    measurements.push({
      timestamp: new Date(now - i * step).toISOString(),
      load: Number(load.toFixed(1)),
      temperature: Number(temp.toFixed(1)),
      voltage: 115000 + (Math.random() * 2000 - 1000),
      vibration: Number((Math.random() * 3).toFixed(2)),
      health: 100 - (load > 90 ? (load - 90) : 0) - (temp > 80 ? (temp - 80) : 0),
    });
  }
  
  return measurements;
}
