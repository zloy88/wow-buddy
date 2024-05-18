import { defineStore, acceptHMRUpdate } from 'pinia'

// useMainStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useMainStore = defineStore('main', {
  state: () => ({
    settings: {
      wowVersion: 'retail',
      wowPath: '',
      wowAccountFolders: [],
      wowRealmFolders: [],
      wowCharacterFolders: [],
      selectedAccountFolder: '',
      selectedRealmFolder: '',
      selectedCharacterFolder: '',
    },
  }),
  getters: {
    getSettings: (state) => state.settings,
    getWowPath: (state) => state.settings.wowPath,
    getWowAccountFolders: (state) => state.settings.wowAccountFolders,
    getWowRealmFolders: (state) => state.settings.wowRealmFolders,
    getWowCharacterFolders: (state) => state.settings.wowCharacterFolders,
    getSelectedAccountFolder: (state) => state.settings.selectedAccountFolder,
    getSelectedRealmFolder: (state) => state.settings.selectedRealmFolder,
    getSelectedCharacterFolder: (state) => state.settings.selectedCharacterFolder,
  },
  actions: {
    setSettings(settings) {
      this.settings = settings
    },
    setWowPath(wowPath) {
      this.settings.wowPath = wowPath
    },
    setWowAccountFolders(wowAccountFolders) {
      this.settings.wowAccountFolders = wowAccountFolders
    },
    setWowRealmFolders(wowRealmFolders) {
      this.settings.wowRealmFolders = wowRealmFolders
    },
    setWowCharacterFolders(wowCharacterFolders) {
      this.settings.wowCharacterFolders = wowCharacterFolders
    },
    setSelectedAccountFolder(selectedAccountFolder) {
      this.settings.selectedAccountFolder = selectedAccountFolder
    },
    setSelectedRealmFolder(selectedRealmFolder) {
      this.settings.selectedRealmFolder = selectedRealmFolder
    },
    setSelectedCharacterFolder(selectedCharacterFolder) {
      this.settings.selectedCharacterFolder = selectedCharacterFolder
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
