<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeSlider } from '@hina-ui/vue'

  const price = ref<[number, number]>([120, 480])
</script>

<template>
  <RangeSlider v-model="price" :max="1000" :step="10" aria-label="价格区间" class="w-64" />
</template>
