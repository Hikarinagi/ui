<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, TimeField } from '@hina-ui/vue'

  const hour = ref<string | null>('20:00')
  const second = ref<string | null>('20:00:30')
  const twelve = ref<string | null>('20:00')
</script>

<template>
  <Stack class="w-56">
    <TimeField v-model="hour" granularity="hour" aria-label="Whole hour" />
    <TimeField v-model="second" granularity="second" aria-label="Seconds" />
    <TimeField v-model="twelve" :hour-cycle="12" aria-label="12-hour clock" />
  </Stack>
</template>
