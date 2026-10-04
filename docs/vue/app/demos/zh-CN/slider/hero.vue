<script setup lang="ts">
  import { ref } from 'vue'
  import { Slider } from '@hina-ui/vue'

  const volume = ref(60)
</script>

<template>
  <Slider v-model="volume" aria-label="音量" class="w-64" />
</template>
