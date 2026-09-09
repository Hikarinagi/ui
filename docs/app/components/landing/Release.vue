<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeCalendar, Stack, Text, type DateRangeValue } from '@hina-ui/vue'

  const { t } = useI18n()
  const range = ref<DateRangeValue | null>({ start: '2026-09-10', end: '2026-09-14' })
</script>

<template>
  <Stack gap="sm" align="start">
    <Text size="sm" weight="medium">{{ t('landing.wall.release.label') }}</Text>
    <RangeCalendar v-model="range" min="2026-09-07" max="2026-09-25" :maximum-days="7" />
    <Text tone="muted" size="sm">{{ t('landing.wall.release.hint') }}</Text>
  </Stack>
</template>
