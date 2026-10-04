<script setup lang="ts">
  import { ref } from 'vue'
  import { Slider, Stack, Text } from '@hina-ui/vue'

  const brightness = ref(40)
</script>

<template>
  <Stack gap="sm" class="w-64">
    <Slider v-model="brightness" aria-label="Brightness" />
    <Text size="sm" tone="muted">Value: {{ brightness }}</Text>
  </Stack>
</template>
