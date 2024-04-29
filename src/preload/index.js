import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// function list to expose to the renderer
const api = {
  fs: {
    getPath: () => ipcRenderer.invoke('getPath'),
    getSettings: () => ipcRenderer.invoke('getSettings'),
    selectFolder: () => ipcRenderer.invoke('selectFolder'),
    getWowAccountFolders: () => ipcRenderer.invoke('getWowAccountFolders'),
    resetSelection: () => ipcRenderer.invoke('resetSelection'),
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('wowbuddy', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.wowbuddy = api
}
