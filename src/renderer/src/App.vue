<script setup>
import FolderSelect from './components/FolderSelect.vue'
import REFlex from "./components/REFlex.vue";
import {useMainStore} from "@/stores/main";

const main = useMainStore()

// receive from main process
window.electron.ipcRenderer.on('getSettings', (event, result) => {
  main.setSettings(result)
})
</script>

<template>
  <FolderSelect/>
  <REFlex/>
</template>
