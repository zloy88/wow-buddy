<script setup>
const {props} = defineProps(['stats'])
</script>
<template v-if="stats">
  <div class="flex flex-row">
    <!-- Loop for check icons -->
    <template v-for="(stat, index) in stats" :key="'check-' + index">
      <svg xmlns="http://www.w3.org/2000/svg" class="check" width="16" height="16" fill="green" viewBox="0 0 16 16">
        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
      </svg>
    </template>

    <!-- Loop for close icons to fill up to 6 total icons -->
    <template v-for="index in (6 - stats)" :key="'close-' + index">
      <svg xmlns="http://www.w3.org/2000/svg" class="close" width="16" height="16" fill="red" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
      </svg>
    </template>
  </div>
</template>
