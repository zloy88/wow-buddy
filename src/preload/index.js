import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {saveSelectedAccountFolder} from "../actions/fileActions";

// function list to expose to the renderer
const api = {
  fs: {
    getPath: () => ipcRenderer.invoke('getPath'),
    getSettings: () => ipcRenderer.invoke('getSettings'),
    selectFolder: () => ipcRenderer.invoke('selectFolder'),
    getWowAccountFolders: () => ipcRenderer.invoke('getWowAccountFolders'),
    getWowRealmFolders: (accountFolder) => ipcRenderer.invoke('getWowRealmFolders', accountFolder),
    getWowCharacterFolders: (realmFolder) => ipcRenderer.invoke('getWowCharacterFolders', realmFolder),
    sendSelectedAccountFolder: (accountFolder) => ipcRenderer.send('setAccountFolder', accountFolder),
    sendSelectedRealmFolder: (realmFolder) => ipcRenderer.send('setRealmFolder', realmFolder),
    sendSelectedCharacterFolder: (characterFolder) => ipcRenderer.send('setCharacterFolder', characterFolder),
    resetSelection: () => ipcRenderer.invoke('resetSelection'),
    parseReflexFile: () => ipcRenderer.invoke('parseReflexFile'),
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
