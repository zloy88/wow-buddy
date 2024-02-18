import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// function list to expose to the renderer
const api = {
  fs: {
    selectFolder: (...args) => ipcRenderer.invoke('seramate:fs:selectFolder', ...args),
    installAddon: (...args) => ipcRenderer.invoke('seramate:fs:installAddon', ...args),
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('seramate', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.seramate = api
}
