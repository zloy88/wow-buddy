<script setup>
import {storeToRefs} from "pinia";
import {useMainStore} from "@/stores/main";

const main = useMainStore()
const {
  getWowPath,
  getWowAccountFolders,
  getWowRealmFolders,
  getWowCharacterFolders,
  getSelectedAccountFolder,
  getSelectedRealmFolder,
  getSelectedCharacterFolder,
  getWowRegion,
} = storeToRefs(main)

// receive from main process
window.electron.ipcRenderer.on('getSettings', (event, result) => {
  main.setSettings(result)
  window.wowbuddy.fs.getWowAccountFolders()
})

// Send to main process
function selectFolder() {
  window.wowbuddy.fs.selectFolder()
}

function resetSelection() {
  window.wowbuddy.fs.resetSelection()
}

function sendSelectedAccount(event) {
  // send selected folder
  window.wowbuddy.fs.sendSelectedAccountFolder(event)
  if (getWowPath) {
    window.wowbuddy.fs.sendSelectedRealmFolder('')
    window.wowbuddy.fs.sendSelectedCharacterFolder('')
    window.wowbuddy.fs.getWowRealmFolders(event)
  }
}

function sendSelectedRealm(event) {
  // send selected folder
  window.wowbuddy.fs.sendSelectedRealmFolder(event)
  if (getWowPath && getSelectedAccountFolder) {
    window.wowbuddy.fs.sendSelectedCharacterFolder('')
    window.wowbuddy.fs.getWowCharacterFolders(event)
  }
}

function sendSelectedCharacter(event) {
  if (getWowPath && getSelectedAccountFolder && getSelectedRealmFolder) {
    window.wowbuddy.fs.sendSelectedCharacterFolder(event)
  }
}
</script>

<template>
  <section class="flex flex-row my-8 gap-4">
    <div class="flex me-4">
        <a class="btn-primary" v-if="!getWowPath" @click="selectFolder">Select Folder</a>
        <a class="btn-primary" @click="resetSelection">Reset</a>
    </div>
    <div v-if="getWowAccountFolders">
      <h2 class="font-bold">Accounts</h2>
      <select @change="sendSelectedAccount($event.target.value)" id="account" name="account" class="block rounded-md border-0 px-2 py-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:max-w-xs sm:text-sm sm:leading-6">
        <option v-for="folder in getWowAccountFolders" :key="folder" :value="folder" :selected="folder === getSelectedAccountFolder">{{ folder }}</option>
      </select>
    </div>
    <div v-if="getWowRealmFolders && getSelectedAccountFolder">
      <h2 class="font-bold">Realms</h2>
      <select @change="sendSelectedRealm($event.target.value)" id="realm" name="realm" class="block rounded-md border-0 px-2 py-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:max-w-xs sm:text-sm sm:leading-6">
        <option v-for="folder in getWowRealmFolders" :key="folder" :value="folder" :selected="folder === getSelectedRealmFolder">{{ folder }}</option>
      </select>
    </div>
    <div v-if="getWowCharacterFolders && getSelectedAccountFolder && getSelectedRealmFolder">
      <h2 class="font-bold">Characters</h2>
      <select @change="sendSelectedCharacter($event.target.value)" id="character" name="character" class="block rounded-md border-0 px-2 py-1.5 text-gray-400 shadow-sm ring-1 ring-inset gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:max-w-xs sm:text-sm sm:leading-6">
        <option v-for="folder in getWowCharacterFolders" :key="folder" :value="folder" :selected="folder === getSelectedCharacterFolder">{{ folder }}</option>
      </select>
    </div>
  </section>
</template>
