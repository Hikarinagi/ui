<script setup lang="ts">
  import { Timeline, type TimelineTone } from '@hina-ui/vue'

  const tones: TimelineTone[] = ['accent', 'neutral', 'success', 'warning', 'danger', 'info']
  const items = tones.map(tone => ({ id: tone, title: tone, tone }))
</script>

<template>
  <Timeline :items="items" />
</template>
