import { contextBridge, ipcRenderer } from 'electron';

// Expose a safe API to the React renderer
contextBridge.exposeInMainWorld('gridSight', {
  files: {
    importDataset: () => ipcRenderer.invoke('files:importDataset'),
    exportReport: (assetId: string, format: string) => ipcRenderer.invoke('files:exportReport', assetId, format),
  },
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  },
  notifications: {
    show: (title: string, body: string) => ipcRenderer.invoke('notifications:show', title, body),
  },
  license: {
    getStatus: () => ipcRenderer.invoke('license:getStatus'),
  },
  updates: {
    check: () => ipcRenderer.invoke('updates:check'),
  },
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    onMaximized: (callback: () => void) => {
      ipcRenderer.on('window:maximized', callback);
      return () => ipcRenderer.removeListener('window:maximized', callback);
    },
    onUnmaximized: (callback: () => void) => {
      ipcRenderer.on('window:unmaximized', callback);
      return () => ipcRenderer.removeListener('window:unmaximized', callback);
    },
  }
});
