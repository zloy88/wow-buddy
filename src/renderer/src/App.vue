<script setup>
import { ref } from 'vue'
import FolderSelect from './components/FolderSelect.vue'
import REFlex from './components/REFlex.vue'
import { useMainStore } from '@/stores/main'

const main = useMainStore()

const updateMessage = ref('')

// receive from main process
window.electron.ipcRenderer.on('updateMessage', (event, message) => {
  updateMessage.value = message
})

window.electron.ipcRenderer.on('getSettings', (event, result) => {
  main.setSettings(result)
})
</script>

<template>
  <div v-if="updateMessage" class="bg-indigo-900 text-center py-4 lg:px-4">
    <div class="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
      <span class="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">New</span>
      <span class="font-semibold mr-2 text-left flex-auto">{{ updateMessage }}</span>
    </div>
  </div>
  <FolderSelect/>
  <REFlex/>
</template>
