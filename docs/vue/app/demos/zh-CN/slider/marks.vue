<script setup lang="ts">
  import { ref } from 'vue'
  import { Slider } from '@hina-ui/vue'

  const speed = ref(50)
  const marks = [
    { value: 0, label: '慢' },
    { value: 25 },
    { value: 50, label: '中' },
    { value: 75 },
    { value: 100, label: '快' },
  ]
</script>

<template>
  <Slider v-model="speed" :step="25" :marks="marks" aria-label="翻页速度" class="w-64" />
</template>
