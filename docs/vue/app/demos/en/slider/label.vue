<script setup lang="ts">
  import { ref } from 'vue'
  import { Slider, Stack } from '@hina-ui/vue'

  const quality = ref(80)
  const opacity = ref(30)
</script>

<template>
  <Stack gap="lg" class="w-64 pt-6">
    <Slider
      v-model="quality"
      label="always"
      :format="(v: number) => `${v}%`"
      aria-label="Image quality"
    />
    <Slider v-model="opacity" label="none" aria-label="Overlay opacity" />
  </Stack>
</template>
