<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, LineClamp, Stack } from '@hina-ui/vue'

  const expanded = ref(false)
</script>

<template>
  <Stack class="w-full max-w-md">
    <Button
      variant="outline"
      tone="neutral"
      size="sm"
      class="self-start"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Fold the synopsis' : 'Expand the synopsis' }}
    </Button>
    <LineClamp v-model:expanded="expanded" :lines="2">
      Only one observer is left at the weather station on the summit. At six every morning he copies
      the night's wind speed and pressure into the log, then radios them down to the town below. The
      first snow of winter closes the mountain road, and the voice at the other end of the radio is
      replaced by a stranger's, claiming to speak from the same station thirty years ago.
    </LineClamp>
  </Stack>
</template>
