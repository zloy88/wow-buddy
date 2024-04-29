<script setup>
import { storeToRefs } from "pinia";
import { useMainStore } from "@/stores/main";

const main = useMainStore()
const { getWowPath, getWowAccountFolders } = storeToRefs(main)

// receive from main process
window.electron.ipcRenderer.on('getSettings', (event, result) => {
  main.setWowPath(result.wowPath)
  main.setWowAccountFolders(result.wowAccountFolders)
})

window.electron.ipcRenderer.on('selectFolder', (event, result) => {
  if (result) {
    main.setWowPath(result)
    // get wow account folders invoke main process
    window.wowbuddy.fs.getWowAccountFolders()
  }
})
window.electron.ipcRenderer.on('getWowAccountFolders', (event, result) => {
  main.setWowAccountFolders(result)
})

async function selectFolder() {
  window.wowbuddy.fs.selectFolder()
}

function resetSelection() {
  window.wowbuddy.fs.resetSelection().then((result) => {
    main.setSettings(result)
  })
}
</script>

<template>
  <section>
    <div>
      <div class="text">
        <h1>Folder Select</h1>
      </div>
      <p>WoW Path: {{getWowPath}}</p>
      <div class="actions">
        <div class="action">
          <a @click="selectFolder()">Select Folder</a>
          <a @click="resetSelection">Reset</a>
        </div>
      </div>
      <div v-if="getWowAccountFolders" class="folders">
        <div v-for="folder in getWowAccountFolders" :key="folder">
          {{folder}}
        </div>
      </div>
    </div>
  </section>
</template>
