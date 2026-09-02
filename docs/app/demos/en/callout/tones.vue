<script setup lang="ts">
  import { Callout, Stack } from '@hikarinagi/ui'

  const tones = [
    { tone: 'neutral', text: 'A plain aside, carrying no mood' },
    { tone: 'accent', text: 'A shortcut worth trying' },
    { tone: 'info', text: 'Background that relates to the current content' },
    { tone: 'success', text: 'The recommended way to do it' },
    { tone: 'warning', text: 'Something to weigh before going ahead' },
    { tone: 'danger', text: 'This cannot be undone' },
  ] as const
</script>

<template>
  <Stack class="w-full max-w-md">
    <Callout v-for="item in tones" :key="item.tone" :tone="item.tone">{{ item.text }}</Callout>
  </Stack>
</template>
