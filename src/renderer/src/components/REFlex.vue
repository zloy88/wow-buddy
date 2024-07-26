<script setup>
import {ref, watch, computed} from "vue";
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
import ShuffleStats from "@renderer/components/ShuffleStats.vue";

const main = useMainStore()
const {
  getLocale,
  getTimeZone,
  getSelectedCharacterFolder
} = storeToRefs(main)

const REFlexData = ref(null);

// receive from main process
window.electron.ipcRenderer.on('getReflexData', (event, result) => {
  REFlexData.value = result
})

// watch getSelectedCharacterFolder
watch(getSelectedCharacterFolder, () => {
  window.wowbuddy.fs.parseReflexFile()
})

// get all REFlexData.type
const types = [
  '2v2',
  '3v3',
  'shuffle'
];

const selectedType = ref(types[0]);
const specData = ref([]);
const selectedClass = ref(null);
const selectedSpec = ref(null);
const filteredData = ref(null);

// watch REFlexData
watch(REFlexData, () => {
  if (REFlexData.value) {

    // get current player
    let currentPlayer = REFlexData.value[0].players[REFlexData.value[0].player_index];

    // get class by id and set selected class
    selectedClass.value = classesDictionary.getClassById(currentPlayer.class_id);
    specData.value = classesDictionary.getAllSpecializationsByClassId(currentPlayer.class_id);
    selectedSpec.value = classesDictionary.getSpecializationById(currentPlayer.spec_id);
  }
})

// Watch selectedType and selectedSpec
watch([selectedType, selectedSpec], () => {
  if (REFlexData.value) {
    filterData();
  }
})

// Function to filter data by selectedType and selectedSpec without overwriting REFlexData
function filterData() {
  // filteredData.value = REFlexData.value;
  filteredData.value = REFlexData.value.filter(data => {
    return data.type === selectedType.value && data.players[data.player_index].spec_id === selectedSpec.value.id;
  });
}

// table sorting
const sortedColumn = ref('time');
const sortedAsc = ref(false);

// sort table by column
function sortTable(columnKey) {
  if (sortedColumn.value === columnKey) {
    sortedAsc.value = !sortedAsc.value;
  } else {
    sortedColumn.value = columnKey;
    sortedAsc.value = true;
  }

  filteredData.value.sort((a, b) => {
    if (sortedAsc.value) {
      return a[sortedColumn.value] - b[sortedColumn.value];
    } else {
      return b[sortedColumn.value] - a[sortedColumn.value];
    }
  });
}

// Count games by winner
const gamesByWinner = computed(() => {
  if (filteredData.value) {
    return filteredData.value.reduce((acc, data) => {
      // if data.type is shuffle, then we need to check if the player won or lost by taking data.player_stats
      if (data.type === 'shuffle') {
        if (data.player_stats) {
          acc.wins += data.player_stats;
          acc.losses += (6 - data.player_stats);
        }
        return acc;
      }
      // if data.type is not shuffle, then we can check the rating_change
      if (data.players[data.player_index].rating_change > 0) {
        acc.wins++;
      } else {
        acc.losses++;
      }
      return acc;
    }, {wins: 0, losses: 0});
  }
});

// Calculate win ratio
const winRatio = computed(() => {
  if (gamesByWinner.value) {
    return ((gamesByWinner.value.wins / (gamesByWinner.value.wins + gamesByWinner.value.losses)) * 100).toFixed() + '%';
  }
});
</script>
<template>
  <section class="flex flex-col justify-center p-4">
    <template v-for="(data, index) in REFlexData">
      <template v-if="index < 3">
        <pre>
          {{ data }}
        </pre>
      </template>
    </template>
    <div class="flex flex-row gap-4 mb-4" v-if="types">
      <template v-for="type in types">
        <button
          @click="selectedType = type"
          :class="selectedType === type ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'"
          class="px-4 py-2">
          {{ type }}
        </button>
      </template>
    </div>
    <div class="flex flex-row gap-4 mb-4" v-if="selectedClass">
      <button class="px-4 py-2 bg-gray-700 text-white">
        {{ selectedClass.name }}
      </button>
      <template v-for="spec in selectedClass.specializations">
        <button
          @click="selectedSpec = spec"
          :class="selectedSpec === spec ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'"
          class="px-4 py-2">
          {{ spec.name }}
        </button>
      </template>
    </div>
    <div v-if="filteredData?.length" class="relative">
      <div class="mb-2 flex gap-4">
        <span>{{ filteredData.length }} games</span>
        <span>{{gamesByWinner.wins}} wins</span>
        <span>{{gamesByWinner.losses}} losses</span>
        <span>{{winRatio}} win rate</span>
      </div>
      <table class="w-full text-sm text-left rtl:text-right text-gray-400 *:cursor-default">
        <thead class="text-xs text-gray-400 uppercase bg-gray-700">
        <tr>
          <th scope="col" class="px-6 py-3" @click="sortTable('time')">
            Date
            <span>
              {{ sortedAsc ? '▲' : '▼' }}
            </span>
          </th>
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
        <tr v-for="(data, iterator) in filteredData" :key="iterator"
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
            <template v-for="player in data.players" v-if="data.type !== 'shuffle'">
              <template v-if="data.player_side !== player.side">
                <PlayerIcon :player="player"/>
              </template>
            </template>
            <template v-else-if="data.type === 'shuffle'">
              <ShuffleStats :stats="data.player_stats"/>
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
