<script setup>
import {ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useMainStore} from "@/stores/main";
import {filename} from 'pathe/utils'
import {formatSeconds, formatUnixTimestamp, formatString} from "~src/utils/utils";
import {classesDictionary} from "~src/utils/data/wowClasses";
import {racesDictionary} from "~src/utils/data/wowRaces";
import {mapsDictionary} from "~src/utils/data/wowMaps";

const main = useMainStore()
const {
  getSettings,
  getSelectedCharacterFolder
} = storeToRefs(main)

const REFlexData = ref(null);

// receive from main process
window.electron.ipcRenderer.on('getSettings', (event, result) => {
  main.setSettings(result)
})

// receive from main process
window.electron.ipcRenderer.on('getReflexData', (event, result) => {
  // order by result time
  result.sort((a, b) => b.time - a.time)
  REFlexData.value = result
})

// watch getSelectedCharacterFolder
watch(getSelectedCharacterFolder, (value) => {
  window.wowbuddy.fs.parseReflexFile()
})

function getSpecImageName(data) {
  // combine class and spec
  const wowClass = formatString(classesDictionary.getClassById(data.class_id).name);
  const wowSpec = formatString(classesDictionary.getSpecializationById(data.spec_id).name);
  return `${wowClass}_${wowSpec}`

}

// images import
const glob = import.meta.glob('@/src/assets/icons/**/*.{jpg,png}', {eager: true})
const images = Object.fromEntries(
  Object.entries(glob).map(([key, value]) => [filename(key), value.default])
)
</script>
<template>
  <section class="flex flex-col justify-center p-4">
    <h1 class="font-bold text-4xl mb-4">Match History</h1>
<!--    <pre>-->
<!--      {{ REFlexData }}-->
<!--    </pre>-->
    <div v-if="REFlexData?.length" class="relative overflow-x-auto">
      <table class="w-full text-sm text-left rtl:text-right text-gray-400">
        <thead class="text-xs text-gray-400 uppercase bg-gray-700">
        <tr>
          <th scope="col" class="px-6 py-3">Date</th>
          <th scope="col" class="px-6 py-3">Arena</th>
          <th scope="col" class="px-6 py-3">Team</th>
          <th scope="col" class="px-6 py-3">MMR</th>
          <th scope="col" class="px-6 py-3">Enemy</th>
          <th scope="col" class="px-6 py-3">MMR</th>
          <th scope="col" class="px-6 py-3">Duration</th>
          <th scope="col" class="px-6 py-3">Damage</th>
          <th scope="col" class="px-6 py-3">Healing</th>
          <th scope="col" class="px-6 py-3">Rating</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="data in REFlexData" :key="data.time"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 *:px-6 *:py-4">
          <td>{{formatUnixTimestamp(data.time)}}</td>
          <td>{{mapsDictionary.getMapById(data.map_id)}}</td>
          <td>
            <img :src="images[getSpecImageName(data.players[data.player_index])]"
                 class="w-8 h-8 inline-block"
                 :title="data.players[data.player_index].name"
                 :alt="data.players[data.player_index].name"/>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No data</p>
    </div>
  </section>
</template>
