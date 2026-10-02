import type { DatasetRepository } from './datasetRepository';
import type { Asset, Dataset, Measurement } from '../types';
import { generateMockMeasurements, mockDataset } from '../data/mockData';

export class ElectronDatasetRepository implements DatasetRepository {
  async getDefaultDataset(): Promise<Dataset> {
    return Promise.resolve(mockDataset);
  }

  async importDataset(): Promise<Dataset> {
    try {
      // Use the securely exposed IPC bridge
      const fileData = await (window as any).gridSight.files.importDataset();
      
      if (!fileData) {
        throw new Error("No file selected or invalid format");
      }
      
      // In a real application, the main process would parse the CSV/JSON and return the Dataset object.
      // We simulate receiving parsed data here.
      if (fileData.parsedDataset) {
        return fileData.parsedDataset as Dataset;
      }
      
      throw new Error("Failed to parse dataset");
    } catch (err) {
      console.error("Dataset import failed:", err);
      throw err;
    }
  }

  async getAssets(): Promise<Asset[]> {
    // In a real desktop app, we'd query an embedded database like SQLite via IPC
    return [];
  }

  async getMeasurements(assetId: string, timeframe: '24h' | '7d' | '30d' | '90d' | '1y'): Promise<Measurement[]> {
    // Fallback to mock generation for demo
    return Promise.resolve(generateMockMeasurements(assetId, timeframe));
  }

  async exportReport(assetId: string, format: 'pdf' | 'json' | 'csv'): Promise<boolean> {
    return (window as any).gridSight.files.exportReport(assetId, format);
  }
}
