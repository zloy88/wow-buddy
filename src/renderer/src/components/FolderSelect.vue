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
  getSelectedCharacterFolder
} = storeToRefs(main)

// receive from main process
window.electron.ipcRenderer.on('getSettings', (event, result) => {
  main.setSettings(result)
  window.wowbuddy.fs.getWowAccountFolders()
  //
  // // parse REFlex data
  // if (getSelectedCharacterFolder) {
  //   window.wowbuddy.fs.parseReflexFile()
  // }
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
    // window.wowbuddy.fs.parseReflexFile(event)
  }
}
</script>

<template>
  <section class="flex flex-col justify-center items-center my-8 gap-4">
    <div>
      <a class="btn-primary" @click="selectFolder">Select Folder</a>
      <a class="btn-primary" @click="resetSelection">Reset</a>
    </div>
    <div>
      <p v-if="getWowPath">
        <span class="font-bold">WoW Path:</span>
        {{ getWowPath }}
      </p>
      <p v-if="getSelectedAccountFolder">
        <span class="font-bold">Selected Acc:</span>
        {{ getSelectedAccountFolder }}
      </p>
      <p v-if="getSelectedRealmFolder">
        <span class="font-bold">Selected Realm:</span>
        {{ getSelectedRealmFolder }}
      </p>
      <p v-if="getSelectedCharacterFolder">
        <span class="font-bold">Selected Char:</span>
        {{ getSelectedCharacterFolder }}
      </p>
    </div>
    <div class="grid grid-cols-3 gap-4">
      <div v-if="getWowAccountFolders">
        <h2 class="font-bold">Accounts</h2>
        <div v-for="folder in getWowAccountFolders" :key="folder">
          <input type="radio" :id="folder" name="account" :value="folder" @change="sendSelectedAccount(folder)"
                 :checked="folder == getSelectedAccountFolder">
          <label :for="folder"><span class="ms-2">{{ folder }}</span></label>
        </div>
      </div>
      <div v-if="getWowRealmFolders && getSelectedAccountFolder">
        <h2 class="font-bold">Realms</h2>
        <div v-for="folder in getWowRealmFolders" :key="folder">
          <input type="radio" :id="folder" name="realm" :value="folder" @change="sendSelectedRealm(folder)"
                 :checked="folder == getSelectedRealmFolder">
          <label :for="folder"><span class="ms-2">{{ folder }}</span></label>
        </div>
      </div>
      <div v-if="getWowCharacterFolders && getSelectedAccountFolder && getSelectedRealmFolder">
        <h2 class="font-bold">Characters</h2>
        <div v-for="folder in getWowCharacterFolders" :key="folder">
          <input type="radio" :id="folder" name="character" :value="folder" @change="sendSelectedCharacter(folder)"
                 :checked="folder == getSelectedCharacterFolder">
          <label :for="folder"><span class="ms-2">{{ folder }}</span></label>
        </div>
      </div>
    </div>
  </section>
</template>
