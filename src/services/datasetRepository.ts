import type { Dataset, Asset, Measurement } from '../types';

export interface DatasetRepository {
  getDefaultDataset(): Promise<Dataset>;
  importDataset(file?: File): Promise<Dataset>;
  getAssets(): Promise<Asset[]>;
  getMeasurements(assetId: string, timeframe: '24h' | '7d' | '30d' | '90d' | '1y'): Promise<Measurement[]>;
  exportReport(assetId: string, format: 'pdf' | 'json' | 'csv'): Promise<boolean>;
}
