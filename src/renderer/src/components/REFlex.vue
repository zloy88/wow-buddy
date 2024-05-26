<script setup>
import {ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useMainStore} from "@/stores/main";
import {mapsDictionary} from "~src/utils/data/wowMaps";
import {classesDictionary} from "~src/utils/data/wowClasses";
import {
  formatSeconds,
  getDateFromUnixTimestamp,
  getTimeFromUnixTimestamp,
  abbreviateNumbers,
  getShortMapName
} from "~src/utils/utils";
import PlayerIcon from "@renderer/components/PlayerIcon.vue";

const main = useMainStore()
const {
  getSettings,
  getLocale,
  getTimeZone,
  getSelectedCharacterFolder
} = storeToRefs(main)

const REFlexData = ref(null);
const specs = ref(null)

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

// watch REFlexData
watch(REFlexData, () => {
  getAllSpecsForSelectedCharacter()
})

// get all specializations by class id
function getAllSpecsForSelectedCharacter() {
  if (REFlexData.value) {
    let firstEntry = REFlexData.value[0]
    specs.value = classesDictionary.getAllSpecializationsByClassId(firstEntry.players[firstEntry.player_index].class_id)
  }
}
</script>
<template>
<!--  <section class="flex flex-row p-4" v-if="specs">-->
<!--    <select id="specs" name="specs"-->
<!--            class="block rounded-md border-0 px-2 py-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:max-w-xs sm:text-sm sm:leading-6">-->
<!--      <option v-for="spec in specs" :key="spec.id" :value="spec.id">-->
<!--        {{ spec.name }}-->
<!--      </option>-->
<!--    </select>-->
<!--  </section>-->
  <section class="flex flex-col justify-center p-4">
    <h1 class="font-bold text-4xl mb-4">Match History</h1>
<!--        <template v-for="(data, index) in REFlexData">-->
<!--          <span v-if="index === 1">-->
<!--            <pre>-->
<!--              {{data}}-->
<!--            </pre>-->
<!--          </span>-->
<!--        </template>-->
    <div v-if="REFlexData?.length" class="relative">
      <table class="w-full text-sm text-left rtl:text-right text-gray-400 *:cursor-default">
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
        <tr v-for="(data, iterator) in REFlexData" :key="data.time"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 *:px-6 *:py-4">
          <td :id="iterator">
            <div class="tooltip">
              {{ getDateFromUnixTimestamp(data.time, getLocale, getTimeZone) }}
              <span class="tooltiptext">
                {{ getTimeFromUnixTimestamp(data.time, getLocale, getTimeZone) }}
              </span>
            </div>
          </td>
          <td>
            <div class="tooltip">
              {{ getShortMapName(mapsDictionary.getMapById(data.map_id)?.name) }}
              <span class="tooltiptext">{{ mapsDictionary.getMapById(data.map_id)?.name }}</span>
            </div>
          </td>
          <td class="flex flex-row">
            <PlayerIcon :player="data.players[data.player_index]"/>
            <template v-for="(player, index) in data.players" v-if="data.type !== 'shuffle'">
              <template v-if="data.player_side === player.side && index !== data.player_index">
                <PlayerIcon :player="player"/>
              </template>
            </template>
            <template v-for="(player, index) in data.players" v-else>
              <PlayerIcon :player="player"/>
            </template>
          </td>
          <td>{{ data.player_mmr }}</td>
          <td class="flex flex-row">
            <template v-for="player in data.players">
              <template v-if="data.player_side !== player.side && data.type !== 'shuffle'">
                <PlayerIcon :player="player"/>
              </template>
            </template>
          </td>
          <td>
            {{ data.enemy_mmr }}
          </td>
          <td>
            {{ formatSeconds(data.duration) }}
          </td>
          <td>
            {{ abbreviateNumbers(data.players[data.player_index].damage) }}
          </td>
          <td>
            {{ abbreviateNumbers(data.players[data.player_index].healing) }}
          </td>
          <td>
            <div class="tooltip">
              <span :class="data.players[data.player_index].rating_change > 0 ? 'text-green-600' : 'text-red-600'">
                {{ data.players[data.player_index].rating_change }}
              </span>
              <span class="tooltiptext">
                {{ data.players[data.player_index].rating_new }} cr
              </span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No data</p>
    </div>
  </section>
</template>
