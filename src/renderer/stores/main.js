import { defineStore, acceptHMRUpdate } from 'pinia'

// useMainStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useMainStore = defineStore('main', {
  state: () => ({
    settings: {
      wowPath: '',
      wowAccountFolders: [],
      wowVersion: 'retail',
    },
  }),
  getters: {
    getSettings: (state) => state.settings,
    getWowPath: (state) => state.settings.wowPath,
    getWowAccountFolders: (state) => state.settings.wowAccountFolders,
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
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
