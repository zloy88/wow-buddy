import {app, shell, BrowserWindow, ipcMain} from 'electron'
import {autoUpdater} from 'electron-updater'
import {join} from 'path'
import {electronApp, optimizer, is} from '@electron-toolkit/utils'
import squirrelStartup from 'electron-squirrel-startup'
import icon from '../../resources/icon.png?asset'
import {
  getSettings,
  getSettingsPath,
  selectWowFolder,
  settingsFileExists,
  createSettingsFile,
  getWowAccountFolders,
  getWowRealmFolders,
  getWowCharacterFolders,
  updateSettingsObject,
  readREFlexData,
  getRegionFromWowPath
} from "../actions/fileActions";

// Handle Squirrel events for Windows
if (squirrelStartup) {
  app.quit();
}

// Enable Update on Dev
// autoUpdater.forceDevUpdateConfig = true;

// Main Window
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Wow Buddy',
    // titleBarStyle: 'hidden',
    // autoHideMenuBar: true,
    backgroundColor: '#000000',
    width: 1400,
    height: 900,
    show: false,
    ...(process.platform === 'linux' ? {icon} : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  mainWindow.setMinimumSize(1120, 600);
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return {action: 'deny'}
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Check if settings file exists
  mainWindow.webContents.on('did-finish-load', () => {
    if (settingsFileExists(app)) {
      // Send settings to renderer
      sendSettings()
    } else {
      createSettingsFile(app);
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Check for updates
  autoUpdater.checkForUpdates();
})

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('updateMessage', 'Update available. Downloading...');
  autoUpdater.downloadUpdate();
})

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Open file/folder dialog
ipcMain.handle('selectFolder', async (event) => {
  selectWowFolder().then((wowPath) => {
    if (wowPath) {
      if (!settingsFileExists(app)) {
        createSettingsFile(app);
      }
      // Write selected folder to settings file
      updateSettingsObject(app, 'wowPath', wowPath)
      // Write wowRegion to settings file
      getRegionFromWowPath(app, wowPath);
      // Send settings to renderer
      sendSettings()
    }
  }).catch((error) => {
    console.error(error);
  })
})


// Get account folders
ipcMain.handle('getWowAccountFolders', async (event) => {
  const settings = getSettings(app);
  getWowAccountFolders(settings.wowPath).then((wowAccountFolders) => {
    if (wowAccountFolders) {
      updateSettingsObject(app, 'wowAccountFolders', wowAccountFolders)
      sendSettings()
    }
  }).catch((error) => {
    console.error(error);
  })
})

// Get realm folders
ipcMain.handle('getWowRealmFolders', async (event) => {
  const settings = getSettings(app);
  getWowRealmFolders(settings.wowPath, settings.selectedAccountFolder).then((wowRealmFolders) => {
    if (wowRealmFolders) {
      updateSettingsObject(app, 'wowRealmFolders', wowRealmFolders)
      sendSettings()
    }
  }).catch((error) => {
    console.error(error);
  })
})

// Get character folders
ipcMain.handle('getWowCharacterFolders', async (event) => {
  const settings = getSettings(app);
  getWowCharacterFolders(settings.wowPath, settings.selectedAccountFolder, settings.selectedRealmFolder).then((wowCharacterFolders) => {
    if (wowCharacterFolders) {
      updateSettingsObject(app, 'wowCharacterFolders', wowCharacterFolders)
      sendSettings()
    }
  }).catch((error) => {
    console.error(error);
  })
})

// Parse REFlex.lua file
ipcMain.handle('parseReflexFile', async (event) => {
  const settings = getSettings(app);

  if (!settings.selectedAccountFolder || !settings.selectedRealmFolder || !settings.selectedCharacterFolder) {
    return;
  }

  try {
    const reflexData = await readREFlexData(
      settings.wowPath,
      settings.selectedAccountFolder,
      settings.selectedRealmFolder,
      settings.selectedCharacterFolder,
      settings.wowRegion
    )

    if (reflexData) {
      // order by result time
      reflexData.sort((a, b) => b.time - a.time)
      // send to renderer
      mainWindow.webContents.send('getReflexData', reflexData);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
})

// Save selected account folder
ipcMain.on('setAccountFolder', async (event, accountFolder) => {
  updateSettingsObject(app, 'selectedAccountFolder', accountFolder);
  sendSettings()
})

// Save selected realm folder
ipcMain.on('setRealmFolder', async (event, realmFolder) => {
  updateSettingsObject(app, 'selectedRealmFolder', realmFolder);
  sendSettings()
})

// Save selected character folder
ipcMain.on('setCharacterFolder', async (event, characterFolder) => {
  updateSettingsObject(app, 'selectedCharacterFolder', characterFolder);
  sendSettings()
})

// delete settings file
ipcMain.handle('resetSelection', async (event) => {
  const settingsPath = getSettingsPath(app);
  if (settingsFileExists(app)) {
    createSettingsFile(app);
    sendSettings()
  }
})

// Send settings to renderer
function sendSettings() {
  const settings = getSettings(app);
  mainWindow.webContents.send('getSettings', settings);
}
