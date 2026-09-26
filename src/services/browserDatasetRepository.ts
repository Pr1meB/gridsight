import type { DatasetRepository } from './datasetRepository';
import type { Asset, Dataset, Measurement } from '../types';
import { mockDataset, generateMockMeasurements } from '../data/mockData';

export class BrowserDatasetRepository implements DatasetRepository {
  async getDefaultDataset(): Promise<Dataset> {
    return Promise.resolve(mockDataset);
  }

  async importDataset(file?: File): Promise<Dataset> {
    if (file) {
      // In a real browser app, we would parse the file (CSV/JSON) here using FileReader
      console.log(`Simulating importing file: ${file.name}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockDataset);
        }, 1000);
      });
    }
    
    // Default mock behavior
    return Promise.resolve(mockDataset);
  }

  async getAssets(): Promise<Asset[]> {
    return Promise.resolve(mockDataset.assets);
  }

  async getMeasurements(assetId: string, timeframe: '24h' | '7d' | '30d' | '90d' | '1y'): Promise<Measurement[]> {
    return Promise.resolve(generateMockMeasurements(assetId, timeframe));
  }

  async exportReport(assetId: string, format: 'pdf' | 'json' | 'csv'): Promise<boolean> {
    console.log(`Browser export of ${assetId} to ${format}`);
    
    // In a browser, we would generate a Blob and create a download link
    const data = JSON.stringify({ assetId, generatedAt: new Date().toISOString() });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${assetId}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return Promise.resolve(true);
  }
}
