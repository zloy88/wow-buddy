<script setup>
import {ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useMainStore} from "@/stores/main";
import { filename } from 'pathe/utils'

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

// watch getSelectedCharacterFolder
watch(getSelectedCharacterFolder, (value) => {
  window.wowbuddy.fs.parseReflexFile()
})

// receive from main process
window.electron.ipcRenderer.on('getReflexData', (event, result) => {
  REFlexData.value = result
})

// images import
const glob = import.meta.glob('@/src/assets/icons/**/*.{jpg,png}', { eager: true })
const images = Object.fromEntries(
  Object.entries(glob).map(([key, value]) => [filename(key), value.default])
)

// ToDo: Create composable from this
function formatSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

function formatUnixTimestamp(unixTimestamp) {
  return new Date(unixTimestamp * 1000).toLocaleString('de-DE', { timeZone: 'Europe/Amsterdam' });
}

function getMapName(mapId) {
  const maps = [
    {
      id: 559,
      name: 'Nagrand Arena (old)',
    },
    {
      id: 562,
      name: "zzOldBlade's Edge Arena",
    },
    {
      id: 572,
      name: 'Ruins of Lordaeron',
    },
    {
      id: 617,
      name: 'Dalaran Sewers',
    },
    {
      id: 618,
      name: 'The Ring of Valor',
    },
    {
      id: 980,
      name: "Tol'Viron Arena",
    },
    {
      id: 1134,
      name: "The Tiger's Peak",
    },
    {
      id: 1170,
      name: 'Shado-Pan Showdown',
    },
    {
      id: 1504,
      name: 'Black Rook Hold Arena',
    },
    {
      id: 1505,
      name: 'Nagrand Arena',
    },
    {
      id: 1552,
      name: "Ashamane's Fall",
    },
    {
      id: 1672,
      name: "Blade's Edge Arena",
    },
    {
      id: 1825,
      name: 'Hook Point',
    },
    {
      id: 1911,
      name: 'Mugambala',
    },
    {
      id: 2167,
      name: 'The Robodrome',
    },
    {
      id: 2373,
      name: 'Empyrean Domain',
    },
    {
      id: 2509,
      name: 'Maldraxxus Coliseum',
    },
    {
      id: 2511,
      name: 'Enigma Arena',
    },
    {
      id: 2547,
      name: 'Enigma Crucible',
    },
    {
      id: 2563,
      name: 'Nokhudon Proving Grounds',
    },
    {
      id: 30,
      name: 'Alterac Valley',
    },
    {
      id: 489,
      name: 'Classic Warsong Gulch',
    },
    {
      id: 529,
      name: 'Classic Arathi Basin',
    },
    {
      id: 566,
      name: 'Eye of the Storm',
    },
    {
      id: 607,
      name: 'Strand of the Ancients',
    },
    {
      id: 628,
      name: 'Isle of Conquest',
    },
    {
      id: 726,
      name: 'Twin Peaks',
    },
    {
      id: 727,
      name: 'Silvershard Mines',
    },
    {
      id: 761,
      name: 'The Battle for Gilneas',
    },
    {
      id: 968,
      name: 'Rated Eye of the Storm',
    },
    {
      id: 998,
      name: 'Temple of Kotmogu',
    },
    {
      id: 1010,
      name: 'CTF3',
    },
    {
      id: 1105,
      name: 'Deepwind Gorge (Legacy)',
    },
    {
      id: 1191,
      name: 'Ashran',
    },
    {
      id: 1280,
      name: 'Southshore vs. Tarren Mill',
    },
    {
      id: 1681,
      name: 'Arathi Basin Winter',
    },
    {
      id: 1686,
      name: 'AI Test - Arathi Basin',
    },
    {
      id: 1691,
      name: 'Cooking: Impossible',
    },
    {
      id: 1715,
      name: 'Battle for Blackrock Mountain',
    },
    {
      id: 1726,
      name: '[TEMP] RaceTrackBG',
    },
    {
      id: 1740,
      name: 'AI Test - Warsong Gulch',
    },
    {
      id: 1782,
      name: 'Seething Strand',
    },
    {
      id: 1802,
      name: '8.0 BG Temp',
    },
    {
      id: 1803,
      name: 'Seething Shore',
    },
    {
      id: 2106,
      name: 'Warsong Gulch',
    },
    {
      id: 2107,
      name: 'Arathi Basin',
    },
    {
      id: 2118,
      name: 'Battle for Wintergrasp',
    },
    {
      id: 2177,
      name: 'Arathi Basin Comp Stomp',
    },
    {
      id: 2197,
      name: "Korrak's Revenge",
    },
    {
      id: 2226,
      name: 'Programmer Map - Battlefield',
    },
    {
      id: 2245,
      name: 'Deepwind Gorge',
    },
    {
      id: 2292,
      name: '8.3 Epic Battleground - Warfront Arathi (PvP)',
    },
  ];
  // return map name by id
  return maps.find(map => map.id === mapId)?.name;
}

function getBracket(PlayersNum, isSoloShuffle) {
  return PlayersNum === 4 ? '2v2' : (PlayersNum === 6 && !isSoloShuffle)? '3v3' : (PlayersNum === 6 && isSoloShuffle) ? 'shuffle' : 'Unknown';
}

function getPlayer(players, PlayerNum) {
  // return player in array where playersNum matches
  return players[PlayerNum-1];
}

function groupPlayersByTeam(players) {
  const teams = {};

  players.forEach(player => {
    const team = player[5]; // Extracting team information (5th value, since arrays are 0-indexed)

    // If team doesn't exist in the teams object, create an empty array for it
    teams[team] = teams[team] || [];

    // Add the player to the corresponding team
    teams[team].push(player);
  });

  return teams;
}

// String to lowercase and replace spaces with underscores
function formatString(string) {
  return string.toLowerCase().replace(/\s+/g, '_');
}
</script>
<template>
  <section class="flex flex-col justify-center p-4">
    <h1 class="font-bold text-4xl mb-4">Match History</h1>
<!--    <pre>-->
<!--      {{REFlexData}}-->
<!--    </pre>-->
    <div v-if="REFlexData?.length" class="relative overflow-x-auto">
      <table class="w-full text-sm text-left rtl:text-right text-gray-400">
        <thead class="text-xs text-gray-400 uppercase bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3">Time</th>
            <th scope="col" class="px-6 py-3">Player</th>
            <th scope="col" class="px-6 py-3">Bracket</th>
            <th scope="col" class="px-6 py-3">Map</th>
            <th scope="col" class="px-6 py-3">Duration</th>
            <th scope="col" class="px-6 py-3">Season</th>
            <th scope="col" class="px-6 py-3">Players</th>
            <th scope="col" class="px-6 py-3">Team-Data</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in REFlexData" :key="data.time" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 *:px-6 *:py-4">
            <td>{{formatUnixTimestamp(data.Time)}}</td>
            <td>{{getPlayer(data.Players, data.PlayerNum)[0]}}</td>
            <td>{{getBracket(data.PlayersNum, data.isSoloShuffle)}}</td>
            <td>{{getMapName(data.Map)}}</td>
            <td>{{formatSeconds(data.Duration)}}</td>
            <td>{{data.Season}}</td>
            <td class="flex gap-4">
              <div v-for="team in groupPlayersByTeam(data.Players)" :key="team.index" class="flex gap-1">
                <div v-for="player in team" :key="player[0]" :title="player[0]">
                  <div class="name hidden">{{ player[0] }}</div>
                  <div class="race hidden">{{ player[6] }}</div>
                  <div class="class hidden">{{ player[7] }}</div>
                  <img class="spec w-[24px]" :src="images[`${formatString(player[7])}_${formatString(player[15])}`]" :title="player[0]" :alt="player[15]"/>
                </div>
              </div>
            </td>
            <td>
              <div v-for="(team, index) in data.TeamData" :key="team[0]">
                <span>Team {{index+1}} {{team[3]}}</span>
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
