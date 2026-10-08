import type { DatasetRepository } from './datasetRepository';
import { BrowserDatasetRepository } from './browserDatasetRepository';
import { ElectronDatasetRepository } from './electronDatasetRepository';
// to determine the environment dynamically.

export function getDatasetRepository(): DatasetRepository {
  // Check if we are running in the Electron environment (via Preload script injection)
  if (window && (window as any).gridSight) {
    console.log("Using Electron environment repository");
    return new ElectronDatasetRepository();
  }
  
  console.log("Using Browser environment repository");
  return new BrowserDatasetRepository();
}
