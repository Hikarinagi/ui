<script setup lang="ts">
  import { ref } from 'vue'
  import { NumberInput, Stack } from '@hina-ui/vue'

  const rating = ref(2.5)
  const pages = ref(12)
</script>

<template>
  <Stack class="w-40">
    <NumberInput v-model="rating" :min="0" :max="10" :step="0.5" aria-label="评分" />
    <NumberInput v-model="pages" :min="1" :step="5" :step-snapping="false" aria-label="页数" />
  </Stack>
</template>
