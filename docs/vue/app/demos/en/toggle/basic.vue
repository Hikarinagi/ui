<script setup lang="ts">
  import { ref } from 'vue'
  import { ListFilter } from '@lucide/vue'
  import { Stack, Text, Toggle } from '@hina-ui/vue'

  const onlyDone = ref(false)
</script>

<template>
  <Stack gap="sm" align="start">
    <Toggle v-model="onlyDone">
      <template #icon><ListFilter /></template>
      Completed only
    </Toggle>
    <Text tone="muted" size="sm">
      {{ onlyDone ? 'Showing completed works' : 'Showing all works' }}
    </Text>
  </Stack>
</template>
