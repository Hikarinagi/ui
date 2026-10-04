<script setup lang="ts">
  import { computed } from 'vue'
  import { MeterGroup, type MeterItem } from '@hina-ui/vue'

  const { t } = useI18n()

  const items = computed<MeterItem[]>(() => [
    { label: t('landing.wall.storage.doc'), value: 42 },
    { label: t('landing.wall.storage.image'), value: 27 },
    { label: t('landing.wall.storage.video'), value: 13 },
    { label: t('landing.wall.storage.other'), value: 8 },
  ])
</script>

<template>
  <MeterGroup :label="t('landing.wall.storage.label')" :items="items" class="w-[320px]" />
</template>
