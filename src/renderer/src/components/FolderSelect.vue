<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/stores/main";

const { settings } = storeToRefs(useMainStore())
const wowPath = ref(settings.wowPath)

// send to main process
const selectFolder = () => window.electron.ipcRenderer.send('seramate:fs:selectFolder')

// receive from main process
window.electron.ipcRenderer.on('seramate:fs:selectFolder', (event, result) => {
  wowPath.value = result.wowPath
})
</script>

<template>
  {{wowPath}}
  <section v-if="!wowPath">
    <div class="text">
      <h1>Folder Select</h1>
    </div>
    <div class="actions">
      <div class="action">
        <a @click="selectFolder">Select Folder</a>
      </div>
    </div>
  </section>
</template>
