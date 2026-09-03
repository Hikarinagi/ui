<script setup lang="ts">
  import { ref } from 'vue'
  import { Slider } from '@hina-ui/vue'

  const rating = ref(3.5)
</script>

<template>
  <Slider v-model="rating" :min="1" :max="5" :step="0.5" aria-label="评分" class="w-64" />
</template>
