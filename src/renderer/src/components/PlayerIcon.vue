<script setup>
import {filename} from 'pathe/utils'
import {classesDictionary} from "~src/utils/data/wowClasses";
import {racesDictionary} from "~src/utils/data/wowRaces";
import {formatString} from "~src/utils/utils";

const props = defineProps(['player'])

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
<template v-if="player">
  <div class="tooltip">
    <img :src="images[getSpecImageName(player)]"
         class="w-8 inline-block"
         :alt="player.name"/>
    <span class="tooltiptext">
      {{ player.name }}<br>
      {{ racesDictionary.getRaceById(player.race_id).name }}<br>
      {{ classesDictionary.getClassById(player.class_id).name }}<br>
      {{ classesDictionary.getSpecializationById(player.spec_id).name }}
    </span>
  </div>
</template>
