<script setup>
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {useMainStore} from "@/stores/main";

const main = useMainStore()
const {
  getSettings,
  getSelectedCharacterFolder
} = storeToRefs(main)

// receive from main process
window.electron.ipcRenderer.on('getSettings', (event, result) => {
  main.setSettings(result)
})

const REFlexData = ref(null);

if (getSelectedCharacterFolder) {
  window.wowbuddy.fs.parseReflexFile()
}

// receive from main process
window.electron.ipcRenderer.on('getReflexData', (event, result) => {
  REFlexData.value = result
  console.log(event)
  console.log(result)
})
</script>
<template>
  <section class="flex flex-col justify-center">
    <h1 class="font-bold text-4xl">REFlex</h1>
    <div v-if="REFlexData">
      <pre>{{REFlexData}}</pre>
    </div>
  </section>
</template>
