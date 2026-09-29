import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: 'GridSight',
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  Menu.setApplicationMenu(null);

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:maximized');
  });
  
  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:unmaximized');
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- IPC Handlers ---

const mockDatasetContent = {
  name: 'Imported Grid Data',
  assets: [
    {
      id: 'PP-200', type: 'Power Plant', name: 'Southwind Wind Farm', healthScore: 98, operatingStatus: 'Online',
      coordinates: { lat: 45.1, lng: -120.2, x: 200, y: 200 }, connectedTo: ['ST-201']
    },
    {
      id: 'ST-201', type: 'Substation', name: 'Highlands Substation', healthScore: 89, operatingStatus: 'Online',
      coordinates: { lat: 45.2, lng: -120.1, x: 400, y: 200 }, connectedTo: ['PP-200']
    }
  ],
  alerts: []
};

ipcMain.handle('files:importDataset', async () => {
  if (!mainWindow) return null;
  
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Import Grid Dataset',
    properties: ['openFile'],
    filters: [{ name: 'Data Files', extensions: ['json', 'csv'] }]
  });

  if (canceled || filePaths.length === 0) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePaths[0], 'utf-8');
    let parsedDataset = mockDatasetContent;
    try {
      const parsed = JSON.parse(content);
      if (parsed.assets) parsedDataset = parsed;
    } catch (e) {
      // Use mock if parsing fails
    }
    return { path: filePaths[0], name: path.basename(filePaths[0]), parsedDataset };
  } catch (err) {
    console.error("Error reading file", err);
    return null;
  }
});

// Window controls
ipcMain.on('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('window:close', () => {
  mainWindow?.close();
});

ipcMain.handle('app:getVersion', () => app.getVersion());
ipcMain.handle('app:getPlatform', () => process.platform);
