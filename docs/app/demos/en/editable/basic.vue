<script setup lang="ts">
  import { ref } from 'vue'
  import { Editable, Stack, Text } from '@hina-ui/vue'

  const title = ref('Untitled document')
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Editable v-model="title" aria-label="Document name" />
    <Text size="sm" tone="muted">Saved: {{ title || '—' }}</Text>
  </Stack>
</template>
