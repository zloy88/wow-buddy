import { defineStore, acceptHMRUpdate } from 'pinia'

// useMainStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useMainStore = defineStore('main', {
  state: () => ({
    settings: {
      wowPath: '',
      wowVersion: 'retail',
    },
  }),
  getters: {
    settings: (state) => state.settings,
  },
  actions: {
    setSettings(settings) {
      this.settings = settings
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
