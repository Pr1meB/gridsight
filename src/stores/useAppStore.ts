import { create } from 'zustand';
import type { Asset, Alert, Dataset } from '../types';
import { getDatasetRepository } from '../services/repositoryFactory';

interface AppState {
  isOffline: boolean;
  dataset: Dataset | null;
  selectedAssetId: string | null;
  assets: Asset[];
  alerts: Alert[];
  isLoading: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  selectAsset: (id: string | null) => void;
  importDataset: (file?: File) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  isOffline: !navigator.onLine,
  dataset: null,
  selectedAssetId: null,
  assets: [],
  alerts: [],
  isLoading: false,

  initialize: async () => {
    set({ isLoading: true });
    const repo = getDatasetRepository();
    const dataset = await repo.getDefaultDataset();
    set({ 
      dataset, 
      assets: dataset.assets, 
      alerts: dataset.alerts,
      isLoading: false 
    });

    // Listen for online/offline events
    window.addEventListener('online', () => set({ isOffline: false }));
    window.addEventListener('offline', () => set({ isOffline: true }));
  },

  selectAsset: (id) => {
    set({ selectedAssetId: id });
  },

  importDataset: async (file) => {
    set({ isLoading: true });
    const repo = getDatasetRepository();
    const dataset = await repo.importDataset(file);
    set({ 
      dataset, 
      assets: dataset.assets, 
      alerts: dataset.alerts,
      selectedAssetId: null,
      isLoading: false 
    });
  }
}));
